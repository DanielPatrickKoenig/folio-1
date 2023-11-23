<template>
    <div>{{ testMessage }}</div>
    <div v-if="propMessage">{{ propMessage }}</div>
</template>
<script>
export default {
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