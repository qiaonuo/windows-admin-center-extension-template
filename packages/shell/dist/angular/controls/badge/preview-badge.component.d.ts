import { Injector } from '@angular/core';
import { CoreBadgeBaseComponent } from './badge-base.component';
/**
 * Defines a preview badge
 */
export declare class PreviewBadgeComponent extends CoreBadgeBaseComponent {
    /**
     * Initializes a new instance of the @see PreviewBadgeComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    constructor(injector: Injector);
    /**
     * Gets the initial host classes to be applied to this element
     */
    protected getInitialHostClasses(): string[];
}
