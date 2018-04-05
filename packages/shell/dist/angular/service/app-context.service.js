var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Injectable } from '@angular/core';
import { AppContext } from '../../core';
import { SmeStylesComponent } from '../controls/styles/sme-styles.component';
import { SvgResource } from '../directives/svg/svg-resource';
import { ActiveConnectionService } from './active-connection.service';
import { AuthorizationService } from './authorization.service';
import { CimStreamService } from './cim-stream.service';
import { CimService } from './cim.service';
import { ConnectionStreamService } from './connection-stream.service';
import { ConnectionTagService } from './connection-tag.service';
import { ConnectionService } from './connection.service';
import { FileTransferService } from './file-transfer.service';
import { FrameService } from './frame.service';
import { GatewayService } from './gateway.service';
import { Navigation } from './navigation';
import { NodeService } from './node.service';
import { NotificationService } from './notification.service';
import { PowerShellStreamService } from './powershell-stream.service';
import { PowerShellService } from './powershell.service';
import { ResourceService } from './resource.service';
import { RpcService } from './rpc.service';
import { SettingsService } from './settings.service';
import { WorkItemService } from './work-item.service';
/**
 * The application context service class.
 */
var AppContextService = /** @class */ (function (_super) {
    __extends(AppContextService, _super);
    /**
     * Initializes a new instance of the AppContextService class.
     *
     * @param activeConnectionService the active connection service.
     * @param authorizationService the authorization service.
     * @param cimService the cim service.
     * @param cimStreamService the cim stream service.
     * @param connectionService the connection service.
     * @param connectionStreamService the connection stream service.
     * @param fileTransferService the file transfer service.
     * @param frameService the frame of window and dialog service.
     * @param gatewayService the gateway service.
     * @param nodeService the node service.
     * @param notificationService the notification service.
     * @param powerShellService the powerShell service.
     * @param powerShellStreamService the powerShell stream service.
     * @param resourceService the resource service.
     * @param rpcService the Rpc service.
     * @param settingsService the settingsService service.
     * @param workItemService the work item service.
     */
    function AppContextService(activeConnectionService, authorizationService, cimService, cimStreamService, connectionService, connectionStreamService, connectionTagService, fileTransferService, frameService, gatewayService, nodeService, notificationService, powerShellService, powerShellStreamService, resourceService, rpcService, settingsService, workItemService) {
        var _this = _super.call(this, activeConnectionService, authorizationService, cimService, cimStreamService, connectionService, connectionStreamService, connectionTagService, fileTransferService, frameService, gatewayService, nodeService, notificationService, powerShellService, powerShellStreamService, resourceService, rpcService, settingsService, workItemService) || this;
        _this.internalResourceService = resourceService;
        _this.internalAuthorizationService = authorizationService;
        return _this;
    }
    /**
     * Initialize the app context resource from AppModule constructor.
     *
     * @param options the app module initialization options.
     */
    AppContextService.prototype.initializeModule = function (options) {
        if (options.svgResource) {
            // register SVG resources to resource service.
            SvgResource.buildRegister(this.internalResourceService, options.svgResource);
        }
        // turn off browser history-push.
        // RouterLink click in html will push history to the browser at default.
        Navigation.turnOffHistory();
        // override PrimeNg Context menu.
        SmeStylesComponent.overridePrimeNgContextMenu();
    };
    /**
     * Register dialog service with dialog id in navigation service
     * @param dialogService dialog service to be registered
     * @param dialogId dialog id associated
     */
    AppContextService.prototype.registerDialogService = function (dialogService, dialogId) {
        this.internalNavigationService.registerDialogService(dialogService, dialogId);
    };
    /**
     * Initializes the app context resource from ngInit call in AppComponent.
     *
     * @param options the App context initialization options.
     */
    AppContextService.prototype.ngInit = function (options) {
        if (options.navigationService) {
            options.navigationService.initialize(options.navigatorServiceOptions);
            this.internalNavigationService = options.navigationService;
        }
    };
    /**
     * Destroy the app context resource from ngDestroy call in AppComponent.
     */
    AppContextService.prototype.ngDestroy = function () {
        if (this.internalNavigationService) {
            this.internalNavigationService.shutdown();
        }
    };
    AppContextService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AppContextService.ctorParameters = function () { return [
        { type: ActiveConnectionService, },
        { type: AuthorizationService, },
        { type: CimService, },
        { type: CimStreamService, },
        { type: ConnectionService, },
        { type: ConnectionStreamService, },
        { type: ConnectionTagService, },
        { type: FileTransferService, },
        { type: FrameService, },
        { type: GatewayService, },
        { type: NodeService, },
        { type: NotificationService, },
        { type: PowerShellService, },
        { type: PowerShellStreamService, },
        { type: ResourceService, },
        { type: RpcService, },
        { type: SettingsService, },
        { type: WorkItemService, },
    ]; };
    return AppContextService;
}(AppContext));
export { AppContextService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvc2VydmljZS9hcHAtY29udGV4dC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBQSxFQUFXLE1BQU8sZUFBQSxDQUFnQjtBQUMzQyxPQUFPLEVBQUUsVUFBQSxFQUFXLE1BQU8sWUFBQSxDQUFhO0FBRXhDLE9BQU8sRUFBRSxrQkFBQSxFQUFtQixNQUFPLHlDQUFBLENBQTBDO0FBQzdFLE9BQU8sRUFBRSxXQUFBLEVBQVksTUFBTyxnQ0FBQSxDQUFpQztBQUM3RCxPQUFPLEVBQUUsdUJBQUEsRUFBd0IsTUFBTyw2QkFBQSxDQUE4QjtBQUN0RSxPQUFPLEVBQUUsb0JBQUEsRUFBcUIsTUFBTyx5QkFBQSxDQUEwQjtBQUMvRCxPQUFPLEVBQUUsZ0JBQUEsRUFBaUIsTUFBTyxzQkFBQSxDQUF1QjtBQUN4RCxPQUFPLEVBQUUsVUFBQSxFQUFXLE1BQU8sZUFBQSxDQUFnQjtBQUMzQyxPQUFPLEVBQUUsdUJBQUEsRUFBd0IsTUFBTyw2QkFBQSxDQUE4QjtBQUN0RSxPQUFPLEVBQUUsb0JBQUEsRUFBcUIsTUFBTywwQkFBQSxDQUEyQjtBQUNoRSxPQUFPLEVBQUUsaUJBQUEsRUFBa0IsTUFBTyxzQkFBQSxDQUF1QjtBQUN6RCxPQUFPLEVBQUUsbUJBQUEsRUFBb0IsTUFBTyx5QkFBQSxDQUEwQjtBQUM5RCxPQUFPLEVBQUUsWUFBQSxFQUFhLE1BQU8saUJBQUEsQ0FBa0I7QUFDL0MsT0FBTyxFQUFFLGNBQUEsRUFBZSxNQUFPLG1CQUFBLENBQW9CO0FBQ25ELE9BQU8sRUFBRSxVQUFBLEVBQVcsTUFBTyxjQUFBLENBQWU7QUFFMUMsT0FBTyxFQUFFLFdBQUEsRUFBWSxNQUFPLGdCQUFBLENBQWlCO0FBQzdDLE9BQU8sRUFBRSxtQkFBQSxFQUFvQixNQUFPLHdCQUFBLENBQXlCO0FBQzdELE9BQU8sRUFBRSx1QkFBQSxFQUF3QixNQUFPLDZCQUFBLENBQThCO0FBQ3RFLE9BQU8sRUFB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RUFBQyxJQUFJLEVBQUUsVUFBVSxHQUFHO1FBQ3BCLEVBQUMsSUFBSSxFQUFFLGdCQUFnQixHQUFHO1FBQzFCLEVBQUMsSUFBSSxFQUFFLGlCQUFpQixHQUFHO1FBQzNCLEVBQUMsSUFBSSxFQUFFLHVCQUF1QixHQUFHO1FBQ2pDLEVBQUMsSUFBSSxFQUFFLG9CQUFvQixHQUFHO1FBQzlCLEVBQUMsSUFBSSxFQUFFLG1CQUFtQixHQUFHO1FBQzdCLEVBQUMsSUFBSSxFQUFFLFlBQVksR0FBRztRQUN0QixFQUFDLElBQUksRUFBRSxjQUFjLEdBQUc7UUFDeEIsRUFBQyxJQUFJLEVBQUUsV0FBVyxHQUFHO1FBQ3JCLEVBQUMsSUFBSSxFQUFFLG1CQUFtQixHQUFHO1FBQzdCLEVBQUMsSUFBSSxFQUFFLGlCQUFpQixHQUFHO1FBQzNCLEVBQUMsSUFBSSxFQUFFLHVCQUF1QixHQUFHO1FBQ2pDLEVBQUMsSUFBSSxFQUFFLGVBQWUsR0FBRztRQUN6QixFQUFDLElBQUksRUFBRSxVQUFVLEdBQUc7UUFDcEIsRUFBQyxJQUFJLEVBQUUsZUFBZSxHQUFHO1FBQ3pCLEVBQUMsSUFBSSxFQUFFLGVBQWUsR0FBRztLQUN4QixFQW5CNkYsQ0FtQjdGLENBQUM7SUFDRix3QkFBQztDQTlJRCxBQThJQyxDQTlJc0MsVUFBVSxHQThJaEQ7U0E5SVksaUJBQWlCIiwiZmlsZSI6ImFwcC1jb250ZXh0LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9