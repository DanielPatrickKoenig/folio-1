<template>
    <div class="cc-dot-markers">
        <a
            v-for="dot in count"
            :key="dot"
            :title="`carousel-marker-${dot}`"
            :aria-label="`carousel-marker-${dot + 1}`"
            class="cc-dot-item"
            :class="[`cc-dot-item-${dot}`, { 'cc-dot-item-active': dot === current + 1 }]"
            @click="dotClicked(dot - 1)"
        />
    </div>
</template>

<script>
    export default {
        props: {
            count: {
                required: true,
                type: Number,
            },
            current: {
                required: true,
                type: Number,
            },
        },
        methods: {
            dotClicked (dot) {
                this.$emit('selected', dot);
            },
        },
    };
</script>

<style>

</style>
