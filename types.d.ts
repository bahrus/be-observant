import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import {Scope} from 'trans-render/lib/types';


export interface WhatToObserve<Props = any> {

    /**
     * An alternative, simpler syntax that reuses common functionality
     */
    of?: Scope;
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
 
     observeName?: string,
     //onm?: string;
     ona?: string,

     homeInOn?: keyof Props & string,
}



export interface WhenToAct<Props = any, TEvent = Event>{
    /**
     * Event name to watch for
     */
     on?: string,

     /**
     * Subscribe to property changes rather than events.
     */
     onSet?: keyof Props & string,

    /** Do not pass in the initial value prior to any events being fired. */
    skipInit?: boolean,

    eventListenerOptions?: boolean | AddEventListenerOptions,

    //capture?: boolean,

    eventFilter?: Partial<TEvent>,

    /**
     * If both the path to the value matches the name of the event (after applying lisp-to-camel), use this string (lisp-case)
     */
    eval?: string;
}

export interface GetValConfig<Props = any> {
    
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
     * Abbreviation for valFromEvent.  Does the same thing.
     */
    vfe?: string,
    /**
     * Perform a structural clone before passing the observed value.
     */
}

export interface AdjustValConfig{

    /**
     * Do a structuredClone of the value before passing it
     */
    clone?: boolean,

    /**
     *  'int' | 'float' | 'bool' | 'date' | 'truthy' | 'falsy' | '' | 'string' | 'object' | 'regExp' | 'Number';  
     */
    parseValAs?: 'int' | 'float' | 'number' | 'bool' | 'date' | 'truthy' | 'falsy' | '' | 'string' | 'object' | 'regExp'

    /** If val is true, set property to this value. */
    trueVal?: any,
    /** If val is false, set property to this value. */
    falseVal?: any,

    translate?: number,

    asWeakRef?: boolean,
}

export interface SideEffects {

    /**
     * Pause JS execution when be-observant is invoked.
     */
    debug?: boolean,

    /**
     * Emit a custom event after setting the property on the element.
     */
    fire?: {
        type: string,
        init: CustomEventInit,
    }

    
    /**
     * Slowly "awaken" a disabled element.  If the disabled attribute is not set to a number, or is set to "1", removes the disabled attribute.  If it is a larger number, decrements the number by 1. 
     */
    nudge?: boolean,

    /**
     * Prevent event from continuing to bubble.
     */
    stopPropagation?: boolean,
}

export interface AlternateEndPoint {
    /** Set attribute rather than property. */
    as?: 'str-attr' | 'bool-attr' | 'obj-attr' | 'class' | 'part',
    

}

export interface IObserve<Props = any, Actions = Props, TEvent = Event> extends
    WhatToObserve<Props>,
    WhenToAct<Props, TEvent>,
    GetValConfig<Props>,
    AdjustValConfig,
    SideEffects,
    AlternateEndPoint
{

}

export type StringOrIObserve<Props = any, Actions = Props, TEvent = Event> = string | IObserve<Props, Actions, TEvent>;

//export type InterpolatingObserveParams<TString = string, TProps = any, TActions = TProps> = string | [TString] | IObserve | InterpolatingObserveParams<TString>[];

//export type IObserveMap<Self = any, Props = any, Actions = Props> = {[key in keyof Self]: InterpolatingObserveParams<String, Props, Actions>};

export type PropObserveMap<Props = any, Actions = Props, TEvent = Event> = {[key: string]: IObserve<Props, Actions, TEvent> | string}

export interface EndUserProps<Props = any, Actions = Props, TEvent = Event> {
    props: PropObserveMap<Props, Actions, TEvent> | PropObserveMap<Props, Actions, TEvent>[];
}

export interface VirtualProps extends EndUserProps, MinimalProxy{}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy
}

export type PP = ProxyProps;

export interface HookUpInfo{
    success: boolean;
    element?: Element;
    controller?: AbortController;
}

export interface Actions{
    finale(proxy: Element & VirtualProps, target:Element): void;
    onProps(pp: PP): void;
}