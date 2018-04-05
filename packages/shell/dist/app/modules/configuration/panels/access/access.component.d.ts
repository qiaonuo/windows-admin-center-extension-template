import { OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppContextService, DialogService, SettingsFormService } from '../../../../../angular';
import { AccessModel } from '.././model/access-model';
import { PanelBaseComponent } from '.././panel-base.component';
export declare class AccessComponent extends PanelBaseComponent<AccessModel> implements OnInit, OnDestroy {
    strings: {
        Core: {
            Error: {
                ArgumentNullError: {
                    message: string;
                };
                ArgumentError: {
                    message: string;
                };
                UnknownBrowser: {
                    message: string;
                };
                GatewayNameRequired: {
                    message: string;
                };
                NoResponseError: {
                    message: string;
                };
                NoCode: {
                    message: string;
                };
                PowerShellUnableSessionClose: {
                    message: string;
                };
                PowerShellUnableCancelCommand: {
                    message: string;
                };
                QueryCacheFetchOrder: {
                    message: string;
                };
                QueryCacheFetchErrorOnce: {
                    message: string;
                };
                QueryCacheRefreshOrder: {
                    message: string;
                };
                QueryCacheRefreshErrorOnce: {
                    message: string;
                };
                QueryCacheRecoverNoCachedResource: {
                    message: string;
                };
                QueryCacheRecoverMissingRecoveryOption: {
                    message: string;
                };
                ResourceCacheUnableFind: {
                    message: string;
                };
                LoggingUnableSubmit: {
                    message: string;
                };
                EnvironmentNotInitialized: {
                    message: string;
                };
                EnvironmentMissingDefault: {
                    message: string;
                };
                NotificationRpcInitialization: {
                    message: string;
                };
                NotificationUnsupportedState: {
                    message: string;
                };
                NotificationEmptyMessage: {
                    message: string;
                };
                NotificationNoWorkItemFound: {
                    message: string;
                };
                NotificationUnexpectedReceived: {
                    message: string;
                };
                NotificationWebsocketInitialize: {
                    message: string;
                };
                NotificationNoIdFound: {
                    message: string;
                };
                RpcTypeNoMatch: {
                    message: string;
                };
                RpcNotFoundModule: {
                    message: string;
                };
                RpcTargetWindowNotConfigured: {
                    message: string;
                };
                RpcExpiredRetry: {
                    message: string;
                };
                RpcExpired: {
                    message: string;
                };
                RpcSignatureError: {
                    message: string;
                };
                RpcUnexpectedDestination: {
                    message: string;
                };
                RpcUnexpectedEvent: {
                    message: string;
                };
                RpcUnexpectedSequence: {
                    message: string;
                };
                RpcUnexpectedErrorSequence: {
                    message: string;
                };
                RpcNotInitialized: {
                    message: string;
                };
                RpcNotFountInbound: {
                    message: string;
                };
                RpcTimeout: {
                    message: string;
                };
                AddNativeErrorCode: {
                    message: string;
                };
                RpcSubjectClosed: {
                    message: string;
                };
                RpcNotRegisteredHandler: {
                    message: string;
                };
                RpcFailedFindModuleManifest: {
                    message: string;
                };
                ForwarderIdConflict: {
                    message: string;
                };
                ForwarderIdNotFound: {
                    message: string;
                };
                ForwarderUnknownType: {
                    message: string;
                };
                InvalidValue: {
                    message: string;
                };
                ServerListRetrieve: {
                    message: string;
                };
                ServerListFailedSave: {
                    message: string;
                };
                ConnectionStream: {
                    message: string;
                };
                ExpectedSingleNode: {
                    message: string;
                };
                ExpectedClusterNode: {
                    message: string;
                };
                BatchConnection: {
                    message: string;
                };
                BatchResponseParsing: {
                    message: string;
                };
                BatchUnSupportedInvocation: {
                    message: string;
                };
                GatewayUrlNotConfigured: {
                    message: string;
                };
                GatewayUrlMalformed: {
                    message: string;
                };
                ToolValidationResult: {
                    message: string;
                };
                ToolValidationUnsupportedOperator: {
                    message: string;
                };
                ToolValidationUnsupportedDataType: {
                    message: string;
                };
                ToolValidationVersionFormat: {
                    message: string;
                };
                PowerShellRunCommandFormat: {
                    message: string;
                };
            };
            ErrorCode: {
                Code0: {
                    message: string;
                };
                Code5: {
                    message: string;
                };
                Code50: {
                    message: string;
                };
                Code87: {
                    message: string;
                };
                Code110: {
                    message: string;
                };
                Code1323: {
                    message: string;
                };
                Code1326: {
                    message: string;
                };
                Code1355: {
                    message: string;
                };
                Code2224: {
                    message: string;
                };
                Code2691: {
                    message: string;
                };
                Code2692: {
                    message: string;
                };
                Code8004108: {
                    message: string;
                };
                Translated: {
                    message: string;
                };
                Generic: {
                    message: string;
                };
            };
            ErrorFormat: {
                Single: {
                    message: string;
                    Details: {
                        message: string;
                    };
                };
                Multiple: {
                    message: string;
                    Details: {
                        message: string;
                    };
                };
            };
            Units: {
                MediaConversionFormat: {
                    message: string;
                };
                MediaConversionUnknownFormat: {
                    message: string;
                };
                MediaConversionB: {
                    label: string;
                };
                MediaConversionKB: {
                    label: string;
                };
                MediaConversionMB: {
                    label: string;
                };
                MediaConversionGB: {
                    label: string;
                };
                MediaConversionTB: {
                    label: string;
                };
                MediaConversionPT: {
                    label: string;
                };
                MediaConversionXB: {
                    label: string;
                };
                MediaConversionZB: {
                    label: string;
                };
                MediaConversionYB: {
                    label: string;
                };
                PercentageConversionPercentFormat: {
                    message: string;
                };
                PercentageConversionUnknownFormat: {
                    message: string;
                };
            };
            Connection: {
                NoConnection: {
                    label: string;
                    message: string;
                };
                NoStatusProvider: {
                    label: string;
                    message: string;
                };
                ErrorState: {
                    label: string;
                };
                FatalState: {
                    label: string;
                };
                OnlineState: {
                    label: string;
                };
                NeedsAuthorizationState: {
                    label: string;
                };
                UnknownState: {
                    label: string;
                };
                WarningState: {
                    label: string;
                };
                ErrorNodeName: {
                    message: string;
                };
                ErrorGatewayUrl: {
                    message: string;
                };
            };
            WebsocketStream: {
                Common: {
                    ConnectionRetiesError: {
                        message: string;
                    };
                    HandlerRegistrationError: {
                        message: string;
                    };
                    CommunicationError: {
                        message: string;
                    };
                    CommunicationErrorDetail: {
                        message: string;
                    };
                };
                CimStream: {
                    ResetError: {
                        message: string;
                    };
                    NoContentError: {
                        message: string;
                    };
                    UnexpectedReceivedError: {
                        message: string;
                    };
                    UnexpectedMultipleError: {
                        message: string;
                    };
                    ConnectionError: {
                        message: string;
                    };
                };
                PowerShellStream: {
                    ResetError: {
                        message: string;
                    };
                    NoContentError: {
                        message: string;
                    };
                    UnexpectedReceivedError: {
                        message: string;
                    };
                    ConnectionError: {
                        message: string;
                    };
                };
            };
        };
        Angular: {
            CapacityBarChart: {
                freeFormat: string;
                totalFormat: string;
                usedFormat: string;
            };
            Common: {
                apply: string;
                back: string;
                cancel: string;
                close: string;
                continue: string;
                details: string;
                disable: string;
                disabled: string;
                discard: string;
                enable: string;
                enabled: string;
                failed: string;
                failure: string;
                finish: string;
                free: string;
                inProgress: string;
                next: string;
                no: string;
                save: string;
                succeeded: string;
                success: string;
                total: string;
                used: string;
                yes: string;
                more: string;
                actions: string;
                expand: string;
                collapse: string;
                on: string;
                off: string;
                OK: {
                    affirmative: string;
                    state: string;
                };
                Form: {
                    Validation: {
                        required: string;
                        UnknownFieldName: string;
                        AlertTypes: {
                            error: string;
                            warn: string;
                            info: string;
                            success: string;
                        };
                        Min: {
                            format: string;
                        };
                        Max: {
                            format: string;
                        };
                        Required: {
                            format: string;
                        };
                        Email: {
                            format: string;
                        };
                        MinLength: {
                            format: string;
                        };
                        MaxLength: {
                            format: string;
                        };
                        Pattern: {
                            format: string;
                        };
                        Capslock: {
                            message: string;
                        };
                    };
                };
            };
            Badges: {
                Preview: {
                    label: string;
                    tooltip: string;
                };
                ComingSoon: {
                    label: string;
                    tooltip: string;
                };
                New: {
                    label: string;
                    tooltip: string;
                };
                Common: {
                    learnMore: string;
                    Aria: {
                        labelFormat: string;
                    };
                    Severities: {
                        warn: string;
                        critical: string;
                    };
                };
            };
            Form: {
                File: {
                    placeholder: string;
                    buttonText: string;
                    multipleFilesFormat: string;
                    invalidFileTypeFormat: string;
                };
            };
            Decorators: {
                Deprecated: {
                    messageFormat: string;
                    alternateSignatureFormat: string;
                };
                Obsolete: {
                    messageFormat: string;
                    alternateSignatureFormat: string;
                };
            };
            DataTable: {
                NoRecordsFound: string;
                Loading: string;
                aria: {
                    label: {
                        nItemsInGroup: string;
                        oneItemInGroup: string;
                        nSubNodesInTreeNode: string;
                        oneSubNodeInTreeNode: string;
                    };
                };
            };
            Resizer: {
                Splitter: string;
            };
            MasterView: {
                oneItem: string;
                items: string;
                selected: string;
                selectedAria: string;
                selectedTitle: string;
                refresh: {
                    title: string;
                };
                filter: {
                    title: string;
                };
            };
            NodeCredentialsForm: {
                deploymentGuideMessage: string;
                refreshMessage: string;
                ApplyToAll: {
                    label: string;
                    warning: string;
                };
                ConstrainedDelegation: {
                    title: string;
                };
                Kerberos: {
                    link: {
                        text: string;
                        href: string;
                    };
                };
                lapsLocalAdminName: {
                    label: string;
                    placeholder: string;
                };
                Password: {
                    label: string;
                    placeholder: string;
                };
                trustedHosts: {
                    configureMessage: string;
                    title: string;
                };
                UseGlobalAuth: {
                    labelFormat: string;
                    myAccount: string;
                    warning: string;
                };
                UseLaps: {
                    label: string;
                };
                UsePerNodeAuth: {
                    label: string;
                };
                Username: {
                    label: string;
                    placeholder: string;
                };
            };
            Navigation: {
                NavigationTitleReturnTypeError: {
                    message: string;
                };
            };
            Wizard: {
                validating: string;
            };
            TagsInput: {
                RemoveTag: {
                    labelFormat: string;
                };
                AddTag: {
                    label: string;
                };
                Instructions: {
                    label: string;
                };
            };
            AlertBar: {
                Warning: string;
                Information: string;
                Error: string;
                DismissAriaLabel: string;
            };
        };
        App: {
            Overview: {
                title: string;
                gatewayStatus: {
                    header: string;
                    versionHeader: string;
                    lastUpdatedHeader: string;
                    buildNumberHeader: string;
                    updateAvailable: string;
                    smeUpdate: string;
                    smeUpdateUri: string;
                    error: string;
                };
                feedback: {
                    header: string;
                    link: {
                        text: string;
                        href: string;
                    };
                };
            };
            Connections: {
                title: string;
                nodeNameHeader: string;
                nodeTypeHeader: string;
                nodeStatusHeader: string;
                nodeOsHeader: string;
                nodeManagingAsHeader: string;
                nodeTagsHeader: string;
                nodeLastConnectedHeader: string;
                connectionTypeHeader: string;
                neverConnectedText: string;
                actions: {
                    add: string;
                    remove: string;
                    editTags: string;
                    connect: string;
                    manageAs: string;
                    manageAsLaps: string;
                    refreshServer: string;
                    search: {
                        placeholder: string;
                    };
                };
                empty: {
                    loading: string;
                    none: string;
                };
                nodeOs: {
                    Nano: string;
                    Server2016: string;
                    Server2012: string;
                    cluster: string;
                };
                gettingStarted: {
                    title: {
                        format: string;
                    };
                };
                serverStatus: {
                    connecting: string;
                    loading: string;
                    unreachable: string;
                    ready: string;
                    unauthorized: string;
                    unknown: string;
                    untrusted: string;
                    unsupported: string;
                    wmiProvidersNotInstalled: string;
                    wmfNotPresent: string;
                    prerequisitesNotMet: string;
                };
                listStatus: {
                    message: string;
                };
                dialogs: {
                    remove: {
                        title: string;
                        messageFormat: string;
                        multiMessageFormat: string;
                        cancelButtonText: string;
                        confirmButtonText: string;
                        error: {
                            titleFormat: string;
                        };
                    };
                    elevate: {
                        confirmButtonText: string;
                        cancelButtonText: string;
                        elevateGatewayTitle: string;
                        elevateGatewayMessage: string;
                    };
                    add: {
                        title: string;
                        typeTitleFormat: string;
                        sideLoadWarning: string;
                        tags: {
                            label: string;
                        };
                        buttons: {
                            cancel: string;
                        };
                    };
                };
                Dialogs: {
                    Buttons: {
                        Close: {
                            label: string;
                        };
                    };
                };
                User: {
                    Error: {
                        title: string;
                    };
                };
                RbacBadge: {
                    label: string;
                    tooltip: string;
                };
            };
            Shell: {
                applicationTitle: string;
                applicationVersionFormat: string;
                applicationTitleAppModeSuffix: string;
                welcomeMessage: string;
                settings: string;
                nodeLabel: string;
                userLabel: string;
                changeConnection: string;
                getUserProfileError: string;
            };
            AppBar: {
                Buttons: {
                    Notifications: {
                        title: string;
                        desc: {
                            format: string;
                        };
                    };
                    Settings: {
                        title: string;
                    };
                    Help: {
                        title: string;
                    };
                };
                Logo: {
                    title: string;
                };
                Nav: {
                    Landmark: {
                        Primary: {
                            aria: {
                                label: string;
                            };
                        };
                    };
                };
            };
            Errors: {
                UnsupportedBrowser: {
                    title: string;
                };
                UnsupportedBrowserCommon: {
                    message: string;
                };
                UnsupportedBrowserFootBegin: {
                    message: string;
                };
                UnsupportedBrowserBody: {
                    message: string;
                };
                UnsupportedBrowserFootEnd: {
                    message: string;
                };
                GenericError: {
                    navigationTitle: string;
                    title: string;
                    message: string;
                    refreshText: string;
                    feedbackInstructions: string;
                };
                ForbiddenError: {
                    navigationTitle: string;
                    title: string;
                    message: string;
                };
                UserProfile: {
                    Get: {
                        formatMessage: string;
                    };
                    Put: {
                        formatMessage: string;
                    };
                };
            };
            Sidebar: {
                launchTitle: string;
                menuTitle: string;
                homeTitle: string;
                connectionsTitle: string;
                generalTitle: string;
                sideLoadWarning: string;
                connectionOverviewTitle: string;
                toolsTitle: string;
                expand: string;
                collapse: string;
                searchPlaceholder: string;
                Nav: {
                    Landmark: {
                        Secondary: {
                            aria: {
                                label: string;
                            };
                        };
                    };
                };
                Aria: {
                    selected: string;
                    nonSelected: string;
                };
            };
            SolutionsList: {
                solutionSelector: string;
                installedSolutions: string;
                sideLoadWarning: string;
                getMore: string;
                settings: string;
            };
            SolutionConnections: {
                connections: {
                    title: {
                        format: string;
                    };
                    sidebar: {
                        landmark: {
                            aria: {
                                label: string;
                            };
                        };
                    };
                };
            };
            IFrame: {
                Reload: {
                    label: string;
                };
                Cancel: {
                    label: string;
                };
                FailedLoad: {
                    title: string;
                    message: string;
                };
                ErrorDescription: {
                    title: string;
                };
                LoadTime: {
                    message: string;
                };
                LoadingCanceled: {
                    message: string;
                };
                TakingLonger: {
                    message: string;
                };
                TakingLongerCancelling: {
                    message: string;
                };
            };
            AboutDialog: {
                Disclosure: {
                    text: string;
                };
                EULA: {
                    text: string;
                };
                KeyboardShortcuts: {
                    text: string;
                    DataTable: {
                        text: string;
                    };
                    Global: {
                        text: string;
                    };
                };
                Privacy: {
                    text: string;
                };
                Version: {
                    label: string;
                };
            };
            KeyboardShortcuts: {
                DataTable: {
                    HomeEnd: {
                        description: string;
                    };
                    LeftRightArrows: {
                        description: string;
                    };
                    PageUpPageDown: {
                        description: string;
                    };
                    UpDownArrows: {
                        description: string;
                    };
                };
                Global: {
                    Arrows: {
                        description: string;
                    };
                    CtrlAltA: {
                        description: string;
                    };
                    HomeEnd: {
                        description: string;
                    };
                    TabShiftTab: {
                        description: string;
                    };
                };
            };
            ManageAsDialog: {
                messageFormat: string;
                messageCountFormat: string;
                title: string;
                validatingMessage: string;
                authError: string;
            };
            EditTagsDialog: {
                title: string;
                AddTags: {
                    label: string;
                };
                RemoveTags: {
                    label: string;
                };
            };
            NotificationsState: {
                failed: string;
                succeeded: string;
                inProgress: string;
            };
            NotificationsDialog: {
                clear: string;
                clearAll: string;
                goTo: string;
                title: string;
                Details: {
                    AriaTitle: string;
                };
                IndeterminateProgress: {
                    AriaValueText: string;
                    AriaLabel: string;
                };
                DeterminateProgress: {
                    AriaLabel: string;
                };
            };
            SettingsDialog: {
                title: string;
                language: string;
                general: string;
                manageExtensions: string;
                extensions: string;
                connection: string;
                port: string;
                certificateThumbprint: string;
                azure: {
                    title: string;
                    aad: string;
                    notConfigured: string;
                    configureHelp: string;
                    setupAad: string;
                    tenant: string;
                    currentUser: string;
                    modifyOrDisableAad: string;
                    createAccount: string;
                    signOut: string;
                };
                ConfirmationDialog: {
                    Discard: string;
                    Continue: string;
                    Message: string;
                    Title: string;
                };
                access: {
                    search: string;
                    description: string;
                    gatewayUsers: string;
                    gatewayAdmins: string;
                    addSecurityGroupHeader: string;
                    addSecurityGroupMessage: string;
                    securityGroupName: string;
                    securityGroupType: string;
                    securityGroup: string;
                    smartCardSecurityGroup: string;
                    machineSecurityGroup: string;
                    save: string;
                    cancel: string;
                    close: string;
                    toolTitle: string;
                    users: string;
                    admins: string;
                    NameTitle: string;
                    typeTitle: string;
                    startedAddingGroup: string;
                    addedGroup: string;
                    removedGroup: string;
                    add: string;
                    delete: string;
                    deleteConfirmation: string;
                    yes: string;
                    no: string;
                    nameTitle: string;
                    currentType: string;
                    changeType: string;
                    learnMore: string;
                    learnMoreAboutControlling: string;
                    controlUsing: string;
                    onPrem: string;
                    azureAd: string;
                    connectToGateway: string;
                    connectToGatewayDesc: string;
                    connectToGatewayTitle: string;
                    connectStep1: string;
                    connectStep2: string;
                    connectStep3: string;
                    manageTitle: string;
                    manageDesc: string;
                    manageSubTitle: string;
                    manageStep1: string;
                    manageStep2: string;
                    manageStep3: string;
                    manageStep4: string;
                    saveWarning: string;
                    manageGuide: string;
                    manageNote: string;
                    aadSuccessMessage: string;
                    adSuccessMessage: string;
                    accessControlType: {
                        azureAD: string;
                        onPrem: string;
                    };
                };
            };
            DayZeroDialog: {
                Next: string;
                Back: string;
                Finish: string;
                SkipTour: string;
                Page1: {
                    Title: string;
                    Subtext: string;
                };
                Page2: {
                    Title: string;
                    Subtext: string;
                };
            };
        };
        Alerts: {
            DirectoryList: {
                Upload: {
                    Error: {
                        FileNotFound: string;
                        OperationBlocked: string;
                        Unknown: string;
                    };
                };
            };
        };
    };
    accessTypeSelection: string;
    form: FormGroup;
    azureAppCreated: boolean;
    aadAuthEnabled: boolean;
    currentType: string;
    private accessService;
    private appSubscription;
    private rootSubscription;
    appClientId: string;
    appObjectId: string;
    constructor(appContextService: AppContextService, router: Router, activatedRoute: ActivatedRoute, dialogService: DialogService, formbuilder: FormBuilder, settingsFormService: SettingsFormService);
    ngOnInit(): void;
    onChangeClick(): void;
    private onChangeAccessClick();
    ngOnDestroy(): void;
    private setCurrentAccessControlType();
    private showErrorAlert(message);
    private showSuccessAlert(message);
    private getAzureAppInfo();
}
