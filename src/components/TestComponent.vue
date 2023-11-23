<template>
    <div>{{ testMessage }}</div>
    <div v-if="propMessage">{{ propMessage }}</div>
    <ComponentEditor />
</template>
<script>
import ComponentEditor from './ComponentEditor/ComponentEditor.vue';
// import ContentCarousel from './ContentCarousel/ContentCarousel.vue';
export default {
    components: {
        // ContentCarousel,
        ComponentEditor,
    },
    props: {
        
        propMessage: {
            required: false,
            default: '',
            type: String,
        }
    },
    data () {
        return {
            testMessage: 'This is a test'
        };
    }
}
</script>