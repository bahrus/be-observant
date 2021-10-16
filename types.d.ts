import {BeDecoratedProps, EventHandler} from 'be-decorated/types';

export interface IObserve{
    /**
     * A css match criteria, used in an "upsearch" for the element to observe.
     */
    observe?: string,
    /**
     * Observe first ancestoer DOM element matching this string
     */
    observeClosest?: string,
    /**
     * Event name to watch for
     */
    on?: string,
    /**
     * The path to the (sub) property of the element being observed.
     * 
     */
    valFromTarget?: string,
    /**
     * Abbreviation for valFromTarget.  Does the same thing
     */
    vft?: string,
    /**
     * The path to the place in the event we want to use as the value to set.  
     * For example:  detail.value
     */
    valFromEvent?: string,
    /**
     * Abbreviation for vfe.  Does the same thing.
     */
    vfe?: string,
    /**
     * Perform a structural clone before passing the observed value.
     */
    clone?: boolean,
    /** Do not hook the initial value prior to any events being fired. */
    skipInit?: boolean,
    /**
     *  'int' | 'float' | 'bool' | 'date' | 'truthy' | 'falsy' | '' | 'string' | 'object';  
     */
    parseValAs?: string,
    /**
     * Subscribe to property changes rather to events.
     */
    onSet?: string,
    /** Set attribute rather than property. */
    as?: 'str-attr' | 'bool-attr' | 'obj-attr',
    /** If val is true, set property to this value. */
    trueVal?: any,
    /** If val is false, set property to this value. */
    falseVal?: any,
}



export interface BeObservantVirtualProps{
    eventHandlers: EventHandler[];
}

export interface BeObservantProps extends BeObservantVirtualProps{
    proxy: Element & BeObservantVirtualProps;
}

export interface BeObservantActions{
    intro(proxy: Element & BeObservantVirtualProps, target: Element, beDecorProps: BeDecoratedProps): void;
    finale(proxy: Element & BeObservantVirtualProps, target:Element): void;
}