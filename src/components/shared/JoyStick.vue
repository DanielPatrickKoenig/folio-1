<template>
    <div class="joy-stick">
        <DraggableContent
            ref="joyStick"
            class="joy-stick-dragger"
            :left="startPosition.xPercent"
            :top="startPosition.yPercent"
            @reposition="stickMoved"
            @position-complete="joyStickMoveComplete"
        >
            <div class="joy-stick-inner">

            </div>
        </DraggableContent>
    </div>
</template>

<script>
import DraggableContent from '../shared/DraggableContent.vue';
import gsap from 'gsap';
export default {
    components: {
        DraggableContent,
    },
    data () {
        return {
            startPosition: {
                xPercent: 50,
                yPercent: 50,
            },
        };
    },
    methods: {
        joyStickMoveComplete (e) {
            const { xPercent, yPercent } = e;
            const stickPosition = { xPercent, yPercent };
            gsap.to(stickPosition, {
                duration: .25,
                xPercent: this.startPosition.xPercent,
                yPercent: this.startPosition.yPercent,
                onUpdate: () => {
                    this.$refs.joyStick.setPositionPercent(stickPosition);
                },
                onComplete: () => {
                    console.log('reposition complete');
                    this.$emit('updating-ended');
                },
            });
        },
        stickMoved (e) {
            const { xPercent, yPercent } = e;
            const direction = {
                x: (xPercent - this.startPosition.xPercent) / 50,
                y: (yPercent - this.startPosition.yPercent) / 50,
            };
            this.$emit('update-direction', direction);
        },
    },
}
</script>

<style>

</style>