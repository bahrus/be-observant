import {BeDecoratedProps, EventHandler, MinimalController, MinimalProxy} from 'be-decorated/types';

export interface IObserve<Props = any, Actions = Props>{
    /**
     * A css match criteria, used in an "upSearch" for the element to observe.
     */
    observe?: string,
    /**
     * Abbrev for observe
     */
    o?: string,
    /**
     * Observe first ancestor DOM element matching this string
     */
    observeClosest?: string,
    oc?: string,

    observeClosestOrHost?: string | boolean,
    /**
     * observe closest or host
     */
    ocoho?: string | boolean,

    observeSelf?: boolean,
    os?: boolean,

    observeHostProp?: string,
    ohop?: string,

    observeWinObj?: string,
    owo?: string,

    observeInward?: string,
    oi?: string;

    
    /**
     * Event name to watch for
     */
    on?: string,

    /**
    * Subscribe to property changes rather than events.
    */
    onSet?: keyof Props & string,

    homeInOn?: keyof Props & string,
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
    /** Do not pass in the initial value prior to any events being fired. */
    skipInit?: boolean,
    /**
     *  'int' | 'float' | 'bool' | 'date' | 'truthy' | 'falsy' | '' | 'string' | 'object';  
     */
    parseValAs?: 'int' | 'float' | 'bool' | 'date' | 'truthy' | 'falsy' | '' | 'string' | 'object',

    /** Set attribute rather than property. */
    as?: 'str-attr' | 'bool-attr' | 'obj-attr',
    /** If val is true, set property to this value. */
    trueVal?: any,
    /** If val is false, set property to this value. */
    falseVal?: any,

    debug?: boolean,

    fire?: {
        type: string,
        init: CustomEventInit,
    }

    translate?: number;

    nudge?: boolean;

    eventListenerOptions?: boolean | AddEventListenerOptions,

    capture?: boolean,
}

export type InterpolatingObserveParams<TString = string, TProps = any, TActions = TProps> = string | [TString] | IObserve | InterpolatingObserveParams<TString>[];

export type IObserveMap<Self = any, Props = any, Actions = Props> = {[key in keyof Self]: InterpolatingObserveParams<String, Props, Actions>};

export interface VirtualProps extends MinimalProxy{
    eventHandlers?: EventHandler[];
    subscriptions?: Element[];
}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy
}

export type PP = ProxyProps;

export interface HookUpInfo{
    success: boolean;
    element?: Element;
}

export interface Actions{
    intro(proxy: Element & VirtualProps, target: Element, beDecorProps: BeDecoratedProps): void;
    finale(proxy: Element & VirtualProps, target:Element): void;
}