import { BaseHelper } from './base';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HTTP as HttpClientNative } from '@ionic-native/http/ngx'; 

import { MessageHelper } from './message';
import { GeneralHelper } from './general';

import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

@Injectable()
export class SessionHelper
{     
    disableDoHttpRequestErrorControl = false; 
    doHttpRequestLastTime = 0;
    
    socket = null; 
    
    constructor(
      private httpClient: HttpClient,
      private httpClientNative: HttpClientNative,
      private messageHelper: MessageHelper,
      private generalHelper: GeneralHelper) 
    {
      this.preLoad();
    }

    private preLoad()
    {
      if(BaseHelper.isIos || BaseHelper.isAndroid)
      {
        this.httpClientNative.setServerTrustMode('nocheck');
      }
      
      if(BaseHelper.backendServiceControl == null)
        this.backendServiceControl();
    }

    private backendServiceControl()
    {
      setTimeout(() => 
      {
        this.doHttpRequest("POST", BaseHelper.backendUrl, null)
        .then((data) => BaseHelper.backendServiceControl = true)
        .catch((errorMessage) => 
        {
            if(errorMessage == '***') return;
            this.messageHelper.sweetAlert("Sunucu servisleri şuan çalışmıyor olabilir. Sorun yaşarsanız bir süre sonra tekrar deneyin.", "Sunucuya erişilemedi", 'warning');
        });
      }, 100);
    }

    public getBackendUrlWithToken()
    {
      if(BaseHelper.token.length == 0) 
      {
        this.generalHelper.navigate("/login");
        return '';
      }

      return BaseHelper.backendUrl + BaseHelper.token + "/";
    }

    private getHttpObjectNative(type:string, url:string, data:object)
    {
      if(typeof data == "undefined" || data == null) data = {};
        
      switch (type) 
      {
        case "GET": 
          url = this.dataInjectionInUrl(url, data);
          return this.httpClientNative.get(url, {}, {});
        case "POST": return this.httpClientNative.post(url, data, {});
        case "PUT": 
        case "DELETE": 
            return null;
      }
    }
    
    private getHttpObjectBrowser(type:string, url:string, data:object)
    {
      switch (type) 
      {
        case "GET": 
          url = this.dataInjectionInUrl(url, data);
          return this.httpClient.get(url);
        case "POST": return this.httpClient.post(url, data);
        case "PUT": return this.httpClient.put(url, data);
        case "DELETE": return this.httpClient.delete(url, data);
      }
    }

    private dataInjectionInUrl(url, data)
    {
      if(data == null) return url;

      if(url.indexOf('?') == -1) url += "?";

      var keys = Object.keys(data);
      for(var i = 0; i < keys.length; i++)
        url += keys[i] + "=" + data[keys[i]] + "&";

      return encodeURI(url);
    }

    private redirectLoginPageIfTokenIsFail(response)
    {
      if(typeof response != "undefined" && response != null)
        if(typeof response.data != "undefined")
          if(typeof response.data.message != "undefined")
            if(response.data.message == "fail.token")
            {
              BaseHelper.clearUserData();
              this.generalHelper.navigate("/login");
              return true;
            }

      return false;
    }

    private initializeDBConfirmation()
    {
      Swal.fire(
      {
        title: 'İlk kurulum',
        text: "Veritabanı daha önce kurulmamış. Şimdi ilk kurulumu yapmak ister misiniz? Dikkat edin! bu işlem tüm veritabanını siler yeniden oluşturur!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet şimdi yapacağım!'
      })
      .then((result) => 
      {
        if (result.value) 
        {
          this.messageHelper.toastMessage('Bu işlem zaman alabilir tamamlandığında size bildirilecek...');

          this.doHttpRequest("POST", BaseHelper.backendUrl + "initializeDb")
          .then((data) =>
          {
            var message = "Tebrikler kurulum başarılı!"
              
            Swal.fire("Başarılı!", message, "success");
          })
          .catch((errorMessage) =>
          {
            var message = "Malesef veritabanı başlatılamadı! Tarayıcınızın geliştirici araçlarından ";
            message += " network geçmişinize bakabilir yada destek sayfamızı ziyaret edebilirsiniz.";
              
            Swal.fire("Yapılamadı!", message, "warning");
          });
        }
      });
    }

    private redirectInitializeIfDbNotInitialized(response)
    {
      if(this.disableDoHttpRequestErrorControl) return false;
      
      if(typeof response != "undefined" && response != null)
        if(typeof response.data != "undefined")
          if(typeof response.data.message != "undefined")
            if(response.data.message == "db.is.not.initialized")
            {
              this.initializeDBConfirmation();
              return true;
            }

      return false;
    }

    private convertFromServerMessageToHumanMessage(message)
    {
      var messages = 
      {
        "mail.or.password.incorrect": "Mail yada şifre hatalı",
        'no.auth': "Yetkiniz Yok!",
      }

      if(typeof messages[message] == "undefined") return message;

      return messages[message];
    }

    private alertIfErrorHaveServerMessage(response)
    {
      if(this.disableDoHttpRequestErrorControl) return false; 
      
      if(typeof response != "undefined" && response != null)
        if(typeof response.data != "undefined")
          if(typeof response.data.message != "undefined")
          {
            this.messageHelper.sweetAlert(this.convertFromServerMessageToHumanMessage(response.data.message), 'Hata', 'warning')
            return true;
          }

      return false;
    }
    
    public async doHttpRequest(type: string, url: string, data: object = {})
    {
      do 
      {
        await BaseHelper.sleep(50); 
        var now = (new Date()).getTime();
      } while ((now - this.doHttpRequestLastTime) < 900);

      this.doHttpRequestLastTime = now;

      this.generalHelper.startLoading();
      
      return new Promise((resolve, reject) =>
      {
        if(BaseHelper.isBrowser || true)
            return this.doHttpRequestBrowser(type, url, data, resolve, reject);
        else if(BaseHelper.isAndroid || BaseHelper.isIos)  
            return this.doHttpRequestNative(type, url, data, resolve, reject);
        else
        {
            this.generalHelper.stopLoading();
            reject("uncorrect.platform.for.doHttpRequest");            
        }
      });
    }
    
    public async doHttpRequestNative(type: string, url: string, data: object, resolve, reject)
    {
        var temp = this.getHttpObjectNative(type, url, data);        
        if(temp == null)
        {
            this.generalHelper.stopLoading();
            reject("uncorrect.http.method.for.doHttpRequestNative"); 
            return;           
        }
              
        var th = this;  
        temp.then(data => 
        {
            console.log(data);//silme!
            
            this.generalHelper.stopLoading();
            
            var response = null;
            try
            {
                response = BaseHelper.jsonStrToObject(data.data);
            }
            catch(err)
            {
                response = {"data": data.data};
            }
                
            resolve(response["data"]);

        })
        .catch(error => 
        {
            console.log(error);//silme!
            
            var message = null, response = null;
            if(typeof error == "string")
            {
                if(error.indexOf('cordova_not_available') > -1)
                {
                    return th.doHttpRequestBrowser(type, url, data, resolve, reject);
                }
                else
                {
                    message = error;
                    response = {};
                }
            }
            else
            {
                response = {};
                try
                {                    
                    response = BaseHelper.jsonStrToObject(error.error);
                    message = "server.response."+error.status;
                }
                catch (err) 
                {
                    message = error.error;
                    if(typeof message == "undefined" && typeof error.message != "undefined") message = error.message;
                    
                    response = {};
                }
            }
            
            th.doHttpRequestError(url, resolve, reject, message, response);
        });
    }

    public async doHttpRequestBrowser(type: string, url: string, data: object, resolve, reject)
    {
        var th = this;
        
        this.getHttpObjectBrowser(type, url, data)
        .subscribe( 
        response => 
        {
          this.generalHelper.stopLoading();
          resolve(response["data"]);
        },
        error =>
        {
          th.doHttpRequestError(url, resolve, reject, error.message, error.error);
        });
    }
    
    public doHttpRequestError(url, resolve, reject, message, response)
    {
        this.generalHelper.stopLoading();

        if(url.indexOf('initialize-db') > -1) reject(message);

        if(this.redirectInitializeIfDbNotInitialized(response)) 
        {
          resolve(message);
          return;
        }          
        else if(this.redirectLoginPageIfTokenIsFail(response)) 
        {
          reject(message);
          return;
        }           
        else if(this.alertIfErrorHaveServerMessage(response)) 
        {
          reject("***");
          return;
        }    

        if(!this.disableDoHttpRequestErrorControl)
        {
          this.messageHelper.sweetAlert("Sunucuyla iletişimde bir hata oldu: " + message, "", 'warning');
          reject("***");
          return;
        } 
        
        reject(message);
    }

    public login(email:string, password:string)
    {
      return this.doHttpRequest("POST", BaseHelper.backendUrl+"login", 
      {
        email: email, 
        password: password,
        clientInfo: 
        {
          type: 'browser',
          agent: navigator.userAgent,
          firebaseToken: BaseHelper.firebaseToken
        }
      });
    }

    public userImitation(user)
    {
        var url = this.getBackendUrlWithToken()+"getUserToken/"+user.id;
        
        this.generalHelper.startLoading();

        this.doHttpRequest("POST", url)
        .then((data) => 
        {
            this.generalHelper.stopLoading();

            if(typeof data['token'] == "undefined")
                this.messageHelper.sweetAlert("Beklenmedik cevap geldi!", "Hata", "warning");
            else
                this.loginWithImitationUser(data['token']);
        })
        .catch((e) => { this.generalHelper.stopLoading(); });
    }

    private navigateToPage(page)
    {
      if(window.location.href.indexOf(page) == -1)
        this.generalHelper.navigate(page);

      setTimeout(() => {
        window.location.reload();
      }, 100);
    }

    public loginWithImitationUser(token)
    {
      BaseHelper.writeToLocal("realUserToken", BaseHelper.token);

      BaseHelper.setToken(token);
      this.fillLoggedInUserInfo()
      .then((data) =>
      {
        this.messageHelper.toastMessage("Kullanıcı taklit ediliyor");
        this.navigateToPage('dashboard');
      });
    }

    public logoutForImitationUser()
    {
      var url = this.getBackendUrlWithToken() + "logOut";

      return this.doHttpRequest("POST", url, null) 
      .then((data) =>  
      {
        BaseHelper.clearUserData();
        
        var token = BaseHelper.readFromLocal("realUserToken");
        BaseHelper.setToken(token);
        
        this.fillLoggedInUserInfo()
        .then((data) =>
        {
          BaseHelper.removeFromLocal("realUserToken");

          this.messageHelper.toastMessage("Gerçek kullanıcıya dönüldü");

          this.navigateToPage('table/users');
        });
        
      });
    }

    public logout()
    {
      var url = this.getBackendUrlWithToken() + "logOut";

      return this.doHttpRequest("POST", url, null) 
      .then((data) =>  
      {
        BaseHelper.clearUserData()
        this.generalHelper.navigate('/login');
      })
    }

    public fillLoggedInUserInfo()
    {
      var temp = this.getBackendUrlWithToken();
      if(temp.length == 0) return null;
      
      var url = temp + "getLoggedInUserInfo";

      return this.doHttpRequest("POST", url, null) 
      .then((data) =>  
      {
        BaseHelper.setLoggedInUserInfo(data);
        return data;
      });
    }

    public tokenControl()
    {
      return this.doHttpRequest("POST", this.getBackendUrlWithToken(), null);  
    }

    public mapAuthControl()
    {
      if(BaseHelper.loggedInUserInfo == null) return false;
      if(typeof BaseHelper.loggedInUserInfo['auths'] == "undefined") return false;
      if(typeof BaseHelper.loggedInUserInfo['auths']['map'] == "undefined") return false;
      if(typeof BaseHelper.loggedInUserInfo['auths']['map'][0] == "undefined") return false;

      return true;
    }
    
    public recordImportAuthControl()
    {
      if(BaseHelper.loggedInUserInfo == null) return false;
      if(typeof BaseHelper.loggedInUserInfo['auths'] == "undefined") return false;
      if(typeof BaseHelper.loggedInUserInfo['auths']['admin'] == "undefined") return false;
      if(typeof BaseHelper.loggedInUserInfo['auths']['admin']['recordImport'] == "undefined") return false;

      return true;
    }
    
    public debugUserAuthControl()
    {
      if(BaseHelper.loggedInUserInfo == null) return false;
      if(typeof BaseHelper.loggedInUserInfo['debug_user'] == "undefined") return false;
      
      return BaseHelper.loggedInUserInfo['debug_user'];
    }

    public kmzAuthControl()
    {
      if(!this.mapAuthControl()) return false;
      if(typeof BaseHelper.loggedInUserInfo['auths']['map']['kmz'] == "undefined") return false;

      return true;
    }

    public getLoggedInUserInfo()
    {
      if(BaseHelper.loggedInUserInfo == null) 
        return this.fillLoggedInUserInfo();

      return this.tokenControl()
      .then((data) =>
      {
        return BaseHelper.loggedInUserInfo;
      });
    }

    public toSeo(str) 
    {
      if(typeof str == "undefined" || str == null) str = "";
      
      str = str.replace(/ /g, "_");
      str = str.replace(/</g, "");
      str = str.replace(/>/g, "");
      str = str.replace(/"/g, "");
      str = str.replace(/é/g, "");
      str = str.replace(/!/g, "");
      str = str.replace(/’/, "");
      str = str.replace(/£/, "");
      str = str.replace(/^/, "");
      str = str.replace(/#/, "");
      str = str.replace(/$/, "");
      str = str.replace(/\+/g, "");
      str = str.replace(/%/g, "");
      str = str.replace(/½/g, "");
      str = str.replace(/&/g, "");
      str = str.replace(/\//g, "");
      str = str.replace(/{/g, "");
      str = str.replace(/\(/g, "");
      str = str.replace(/\[/g, "");
      str = str.replace(/\)/g, "");
      str = str.replace(/]/g, "");
      str = str.replace(/=/g, "");
      str = str.replace(/}/g, "");
      str = str.replace(/\?/g, "");
      str = str.replace(/\*/g, "");
      str = str.replace(/@/g, "");
      str = str.replace(/€/g, "");
      str = str.replace(/~/g, "");
      str = str.replace(/æ/g, "");
      str = str.replace(/ß/g, "");
      str = str.replace(/;/g, "");
      str = str.replace(/,/g, "");
      str = str.replace(/`/g, "");
      str = str.replace(/|/g, "");
      str = str.replace(/\./g, "");
      str = str.replace(/:/g, "");
      str = str.replace(/İ/g, "i");
      str = str.replace(/I/g, "i");
      str = str.replace(/ı/g, "i");
      str = str.replace(/ğ/g, "g");
      str = str.replace(/Ğ/g, "g");
      str = str.replace(/ü/g, "u");
      str = str.replace(/Ü/g, "u");
      str = str.replace(/ş/g, "s");
      str = str.replace(/Ş/g, "s");
      str = str.replace(/ö/g, "o");
      str = str.replace(/Ö/g, "o");
      str = str.replace(/ç/g, "c");
      str = str.replace(/Ç/g, "c");
      str = str.replace(/–/g, "_");
      str = str.replace(/—/g, "_");
      str = str.replace(/—-/g, "_");
      str = str.replace(/—-/g, "_");

      return str.toLowerCase();
    }

    async eSignCancel(sign)
    {
      var url = this.getBackendUrlWithToken()+"tables/e_signs/"+sign["id"]+"/update";

      var setId = BaseHelper.loggedInUserInfo.auths['tables']['e_signs']["edits"][0];
      
      var params = 
      {
        "column_set_id": setId,
        "in_form_column_name": "state",
        "single_column": "state",
        "state": 0
      };

      return this.doHttpRequest("POST", url, params) 
      .then((data) => 
      {
        if(data["message"] == "success") return true;

        this.messageHelper.sweetAlert("İmzalama reddederken hata oluştu!", 'Hata', 'warning');
        return false;
      })
      .catch((e) => 
      {
        this.messageHelper.sweetAlert("İmzalama reddederken hata oluştu!", 'Hata', 'warning');
      });
    }

    doESign(sign, password)
    {
      console.log('imzala');

      var columnSetId = BaseHelper.loggedInUserInfo['auths']['tables']['e_signs']['edits'][0];

      var data =
      {
        type: "doESign",
        columnSetId: columnSetId,
        url: "https://kamu.kutahya.gov.tr/api/v1/"+BaseHelper.token+"/tables/e_signs/"+sign.id+"/update",
        pin: password,
        recordId: sign.id,
        text: sign['signed_text']
      };
 
      this.sendESignMessage(BaseHelper.objectToJsonStr(data));
    }

    getConnectedeSignSocket()
    {
      if(this.socket != null)
      {
        console.log("socket kontrol et connected ise return olsun");
        return this.socket;
      }

      try 
      {
        var host = 'ws://127.0.0.1:4326';
        this.socket = new WebSocket(host);  

        return this.socket;
      } 
      catch (error) 
      {
        return null;
      }
    }

    async sendESignMessage(msg)
    {
      console.log('sokete gonder: ' + msg);
      this.socket.send(msg);
    }
}