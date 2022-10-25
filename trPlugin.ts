import {RenderContext, TransformPluginSettings} from 'trans-render/lib/types';
import {DEMethods} from 'be-decorated/types';
import {register} from 'trans-render/lib/pluginMgr.js';

export const trPlugin: TransformPluginSettings = {
    selector: 'beObservableAttribs',
    ready: true,
    processor:  async (ctx:  RenderContext) => {
        const {target} = ctx;
        if(customElements.get('be-observant') === undefined) return;
        const {attach} = await import('be-decorated/upgrade.js');
        const instance = document.createElement('be-observant') as any as DEMethods;
        attach(target!, 'clonable', ctx, instance.attach.bind(instance));
    }
}

register(trPlugin);