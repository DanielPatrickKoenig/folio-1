<template>
    <div>
        <div class="ce-editor-ui">
            <select 
                v-model="currentComponent"
                @change="onComponentChange"
            >
                <option 
                    v-for="(comp, i) in contentComponents"
                    :key="i"
                    :value="i"
                >
                    {{ comp.label }}
                </option>
            </select>
            <div
                v-for="(prop, i) in editableProperties"
                :key="i"
            >
                <label>
                    <span>
                        {{ prop.label }}
                    </span>
                    <input
                        :type="prop.type"
                        :pid="prop.property"
                        v-model="editableValues[i]"
                        @change="onInputChange"
                    />
                </label>
            </div>
            {{ this.propertyMap }}
        </div>
        <div class="ce-component-container">
            <component 
                :is="contentComponents[currentComponent].component"
                v-bind="propertyMap"
                :slides="content"
                ref="compo"
            >
                <template #slide="{ index }">
                    <div class="content-slide">
                        {{ index }}
                    </div>
                </template>
            </component>
        </div>
    </div>
</template>

<script>
import ContentCarousel from '..//ContentCarousel/ContentCarousel.vue';
import ContentAccordion from '..//ContentAccordion/ContentAccordion.vue';
import ContentCoverFlow from '..//ContentCoverFlow/ContentCoverFlow.vue';
import ContentScrapBook from '..//ContentScrapBook/ContentScrapBook.vue';
import ContentLazyGrid from '..//ContentLazyGrid/ContentLazyGrid.vue';
import ContentPages from '..//ContentPages/ContentPages.vue';
import { DataTypes } from '../../utils/Utilities';
export default {
    components: {
        ContentCarousel,
        ContentAccordion,
        ContentCoverFlow,
        ContentScrapBook,
        ContentLazyGrid,
        ContentPages,
    },
    data () {
        return {
            contentComponents: [
                { label: 'Carousel', component: ContentCarousel },
                { label: 'Accordion', component: ContentAccordion },
                { label: 'Cover Flow', component: ContentCoverFlow },
                { label: 'Scrap Book', component: ContentScrapBook },
                { label: 'Lazy Grid', component: ContentLazyGrid },
                { label: 'Paginated', component: ContentPages },
            ],
            currentComponent: 0,
            availableComonents: [
                { component: ContentCarousel, name: 'Content Carousel' },

            ],
            editableProperties: [],
            editableValues: [],
            propertyMap: {},
            content: [...new Array(16).keys()].map(item => {
                return {
                    title: `slide numbrer ${item}`,
                    scrapBook: {
                        rotation: 0,
                        x: 5 * item,
                        y: 5,
                        width: 10,
                        height: 10,
                    },
                };
            }),
            DataTypes,
        }
    },
    mounted () {
        // this.contentComponents = this.$refs.compo;
        console.log('content components', this.$refs.compo.$options.computed.propsMap());
        this.setEditableProperties();
    },
    methods: {
        getContentComponents () {
            return this.$children;
        },
        setEditableProperties () {
            this.editableProperties = this.$refs.compo.$options.computed.propsMap();
            this.editableValues = this.editableProperties.map(item => this.$refs.compo[item.property]);
            this.propertyMap = {};
            this.editableProperties.forEach((item, index) => {
                this.propertyMap[item.property] = this.editableValues[index];
            });
            
        },
        onInputChange (e) {
            let value = e.target.value;
            if (e.target.type === DataTypes.BOOLEAN) value = e.target.checked;
            if (e.target.type === DataTypes.NUMBER) value = Number(e.target.value);
            this.propertyMap[e.target.getAttribute('pid')] = value;
        },
        onComponentChange () {
            this.setEditableProperties();
        },
    }
}
</script>

<style>

</style>