export const types = [
    
        {
            source: 'list',
            display: 'Liste',
            title: 'Liste Yetkisi',
            table: 'column_arrays',
            in_form_column: 'column_array_ids',
            description: 'Kullanıcıların kayıtları listelerken hengi kolonları göreceğini seçiniz. Bu yetkiyi boş bırakırsanız kullanıclar kayıtları <span class="badge badge-warning">listeleyemezler</span>',
            search: 'tableName:list'
        },
        {
            source: 'create',
            display: 'Ekleme',
            title: 'Ekleme Yetkisi',
            table: 'column_sets',
            in_form_column: 'column_set_ids',
            description: 'Kayıt ekleme formunu ve görünecek kolonları burada belirleyebilirsiniz. Ekleme yetkisi <span class="badge badge-warning">vermemek</span> için boş geçiniz',
            search: 'tableName:create'
        },
        {
            source: 'edit',
            display: 'Güncelleme',
            title: 'Güncelleme Yetkisi',
            table: 'column_sets',
            in_form_column: 'column_set_ids',
            description: 'Kullanıcı kaydı düzenlerken göreceği formu ve kolonları burada belirleyebilirsiniz. Düzenleme yetkisi <span class="badge badge-warning">vermemek</span> için boş geçiniz.',
            search: 'tableName:edit'
        },
        {
            source: 'delete',
            display: 'Silme',
            title: 'Silme Yetkisi',
            table: 'data_filters',
            in_form_column: 'data_filter_ids',
            description: 'Kullanıcıların varsayılan olarak kayıt <span class="badge badge-warning">silme yetkisi yoktur</span>. Burada, bu yetkiyi ekleyebilir yada kısıtlayabilirsiniz.',
            search: 'tableName:delete:'
        },        
        {
            source: 'show',
            display: 'Bilgi Kartı',
            title: 'Bilgi Kartı Yetkisi',
            table: 'column_sets',
            in_form_column: 'column_set_ids',
            description: 'Burada kullanıcılar için, zengin bilgi kartları tasarlayabilirsniz. Bilgi kartında farklı tablolardan veriler yada tümüyle tablo olabilir.',
            search: 'tableName:show'
        },
        {
            source: 'querie',
            display: 'Sorgu',
            title: 'Sorgu Yetkisi',
            table: 'column_arrays',
            in_form_column: 'column_array_ids',
            description: 'Kullanıcıların listeleme esnasında görüdğü kolonlardan sorgu yapma yetkisi zaten vardır. Özel olarak sorgu yapabilmesini istediğiniz kolonlar varsa buradan ekleyebilirsiniz.',
            search: 'tableName:querie'
        },             
        {
            source: 'restore',
            display: 'Geri Yükleme',
            title: 'Geri Yükleme Yetkisi',
            table: 'data_filters',
            in_form_column: 'data_filter_ids',
            description: 'Kullanıcıların varsayılan olarak kayıt <span class="badge badge-warning">geri yükleme yetkisi yoktur</span>. Burada, bu yetkiyi ekleyebilir yada kısıtlayabilirsiniz.',
            search: 'tableName:restore:'
        },
        {
            source: 'deleted',
            display: 'Silinmiş Kayıtlar',
            title: 'Silinmiş Kayıtlar Yetkisi',
            table: 'column_arrays',
            in_form_column: 'column_array_ids',
            description: 'Kullanıcıların silinmiş kayıtları geri getirebilmesi için bu ekrandan yetki verebilirsiniz.',
            search: 'tableName:deleted'
        },
        {
            source: 'export',
            display: 'Dışa aktarma',
            title: 'Dışa aktarma Yetkisi',
            table: 'data_filters',
            in_form_column: 'data_filter_ids',
            description: 'Kaydı dışa aktarma varsayılan olarak izinli <span class="badge badge-warning">değildir</span>. İsterseniz ekleyebilirsiniz.',
            search: 'tableName:export:'
        },
        {
            source: 'filters',
            display: 'Diğer Filtreler',
            title: 'Diğer Filtreler Yetkisi',
            table: 'data_filters',
            in_form_column: 'data_filter_ids',
            description: 'İsterseniz diğer işlemler için filtreler oluşturabilirsiniz',
            search: 'filters:tableName:'
        },
        {
            source: 'other',
            display: 'Diğer Yetkiler',
            title: 'Diğer Yetkiler',
            table: '',
            in_form_column: '',
            description: 'İsterseniz diğer yetkileri de ekleyebilirsiniz',
            search: 'tableName:'
        }
];