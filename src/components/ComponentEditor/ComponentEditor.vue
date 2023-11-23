<template>
    <div>
        <div class="ce-editor-ui">
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
            <!-- <select>

            </select> -->
        </div>
        <div class="ce-component-container">
            <component 
                :is="currentComponent"
                v-bind="propertyMap"
                :slides="[...new Array(10).keys()].map(item => `slide-${item}`)"
                ref="compo"
            >
                <template #slide="{ index }">
                    <div>
                        {{ index }}
                    </div>
                </template>
            </component>
        </div>
    </div>
</template>

<script>
import ContentCarousel from '..//ContentCarousel/ContentCarousel.vue';
import { DataTypes } from '../../utils/Utilities';
export default {
    components: {
        ContentCarousel
    },
    data () {
        return {
            contentComponents: [],
            currentComponent: ContentCarousel,
            availableComonents: [
                { component: ContentCarousel, name: 'Content Carousel' },

            ],
            editableProperties: [],
            editableValues: [],
            propertyMap: {},
            content: [...new Array(10).keys()].map(item => `slide-${item}`),
            DataTypes,
        }
    },
    mounted () {
        this.contentComponents = this.$refs.compo;
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
            if (e.target.type === DataTypes.NUMBER) value = Number(e.target.checked);
            this.propertyMap[e.target.getAttribute('pid')] = value;
        },
    }
}
</script>

<style>

</style>