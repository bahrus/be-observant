import {BeDecoratedProps, EventHandler, MinimalController} from 'be-decorated/types';

export interface IObserve<Props = any, Actions = Props>{
    /**
     * A css match criteria, used in an "upSearch" for the element to observe.
     */
    observe?: string,
    /**
     * Observe first ancestor DOM element matching this string
     */
    observeClosest?: string,

    observeClosestOrHost?: string | boolean,
    /**
     * observe closest or host
     */
    ocoho?: string | boolean,

    observeSelf?: boolean,

    observeWinObj?: string,
    
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
    vft?: keyof Props & string,
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
    parseValAs?: 'int' | 'float' | 'bool' | 'date' | 'truthy' | 'falsy' | '' | 'string' | 'object',
    /**
     * Subscribe to property changes rather to events.
     */
    onSet?: keyof Props & string,
    /** Set attribute rather than property. */
    as?: 'str-attr' | 'bool-attr' | 'obj-attr',
    /** If val is true, set property to this value. */
    trueVal?: any,
    /** If val is false, set property to this value. */
    falseVal?: any,

    fromProxy?: string,

    debug?: boolean,

    fire?: {
        type: string,
        init: CustomEventInit,
    }

    translate?: number;
}

export type InterpolatingObserveParams<T> = T | IObserve | InterpolatingObserveParams<T>[];

export type IObserveMap<Self = any, Props = any, Actions = Props> = {[key in keyof Self]: IObserve<Props, Actions> | string};

export interface BeObservantVirtualProps extends MinimalController{
    eventHandlers?: EventHandler[];
}

export interface BeObservantProps extends BeObservantVirtualProps{
    proxy: Element & BeObservantVirtualProps;
}

export interface BeObservantActions{
    intro(proxy: Element & BeObservantVirtualProps, target: Element, beDecorProps: BeDecoratedProps): void;
    finale(proxy: Element & BeObservantVirtualProps, target:Element): void;
}