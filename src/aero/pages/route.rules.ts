import { PagesComponent } from './pages.component';

import { DashboardComponent } from './dashboard/dashboard.component'; 
import { RedirectComponent } from './redirect/redirect.component';
import { LinkPageComponent } from './link-page/link-page.component';
import { ListComponent } from './list/list.component';
import { SearchComponent } from './search/search.component';
import { ArchiveComponent } from './archive/archive.component';
import { DeletedComponent } from './deleted/deleted.component';
import { FormComponent } from './form/form.component';
import { ShowComponent } from './show/show.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthWizardComponent } from './auth-wizard/auth-wizard.component';
import { DataEntegratorComponent } from './data-entegrator/data-entegrator.component';

export const routeRules = 
[{
    path: '',
    component: PagesComponent,
    children: 
    [
        {
            path: 'dashboard',
            component: DashboardComponent,
        }, 
        {
            path: 'home',
            component: LinkPageComponent,
        },          
        {
            path: 'search/:words',
            component: SearchComponent 
        },          
        {
            path: 'table/:tableName',
            component: ListComponent 
        },
        {
            path: 'table/:tableName/create',
            component: FormComponent 
        },
        {
            path: 'table/:tableName/:recordId/edit',
            component: FormComponent 
        },
        {
            path: 'table/:tableName/:recordId/archive',
            component: ArchiveComponent 
        },
        {
            path: 'table/:tableName/deleted',
            component: DeletedComponent 
        },
        {
            path: 'table/:tableName/:recordId',
            component: ShowComponent 
        },
        {
            path: 'table/:tableName/:recordId/getRelationDataId/:columnName',
            component: RedirectComponent 
        },
        {
            path: 'table/:tableName/:recordId/edit',
            component: FormComponent 
        },          
        {
            path: 'authWizard/:tableName/:tableId',
            component: AuthWizardComponent 
        },       
        {
            path: 'dataEntegrator/:tableName/:tableId',
            component: DataEntegratorComponent 
        },
        {
            path: '**',
            component: NotFoundComponent,
        }
    ]
}];