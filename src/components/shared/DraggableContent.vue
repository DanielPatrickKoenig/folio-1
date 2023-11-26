<template>
    <div
        ref="draggableContent"
        class="draggable-content"
    >
        <div 
            class="draggable-content-container"
            :style="{ left: `${dragPosition.xPercent}%`, top: `${dragPosition.yPercent}%`, width, height }"
        >
            <div
                class="draggable-content-item"
                :l="dragPosition.xPercent"
                :t="dragPosition.yPercent"
                @mousedown="down"
                @touchstart="down"
                @touchmove="move"
                @touchend="up"
            >
                <slot>CONTENT</slot>
            </div>
            
        </div>
        <div
            v-if="dragging"
            class="draggable-content-overlay"
            @mousemove="move"
            @touchmove="move"
            @mouseup="up"
            @touchend="up"
        />
    </div>
</template>

<script>
export default {
    props: {
        width: {
            default: '50px',
            required: false,
            type: String,
        },
        height: {
            default: '50px',
            required: false,
            type: String,
        },
        left: {
            default: 20,
            required: false,
            type: Number,
        },
        top: {
            default: 20,
            required: false,
            type: Number,
        },
        itemId: {
            default: '',
            required: false,
            type: String
        },
    },
    data () {
        return {
            dragging: false,
            offsetPostion: { x: 0, y: 0 },
            dragPosition: { xPercent: this.left, yPercent: this.top },
        }
    },
    computed: {
        styles () {
            return { width: this.width, height: this.height, left: this.dragPosition.left, top: this.dragPosition.top };
        },
    },
    methods: {
        processPointerEvent (e) {
            const values = {};
            if (e.type.includes('touch')) {
                if (e.touches.length) {
                    values.x = e.touches[0].pageX;
                    values.y = e.touches[0].pageY;
                }
            }
            else {
                values.x = e.pageX;
                values.y = e.pageY;
            }
            return { x: values.x - this.$refs.draggableContent.getBoundingClientRect().left, y: values.y - this.$refs.draggableContent.getBoundingClientRect().top - document.scrollingElement.scrollTop };
        },
        down (e) {
            const downPosition = this.processPointerEvent(e);
            this.$emit('selected');
            this.dragging = true;
            const processedPosition = this.processPosition({ 
                xPercent: Number(e.currentTarget.getAttribute('l')), 
                yPercent: Number(e.currentTarget.getAttribute('t')),
            });
            this.offsetPostion = { 
                x: downPosition.x - processedPosition.x,
                y: downPosition.y - processedPosition.y
            };
        },
        move (e) {
            if (this.dragging) {
                const movePosition = this.processPointerEvent(e);
                this.dragPosition.x = movePosition.x - this.offsetPostion.x;
                this.dragPosition.y = movePosition.y - this.offsetPostion.y;
                this.setPosition(this.dragPosition);
                // this.dragPosition.xPercent = (this.dragPosition.x / this.$refs.draggableContent.getBoundingClientRect().width) * 100;
                // this.dragPosition.yPercent = (this.dragPosition.y / this.$refs.draggableContent.getBoundingClientRect().height) * 100;
            }
        },
        up () {
            this.dragging = false;
            this.$emit('position-complete', { ...this.dragPosition, id: this.itemId });
        },
        processPosition ({ xPercent, yPercent }) {
            return { 
                x: (xPercent / 100) * this.$refs.draggableContent.getBoundingClientRect().width,
                y: (yPercent / 100) * this.$refs.draggableContent.getBoundingClientRect().height,
            };
        },
        setPosition ({ x, y }) {
            this.dragPosition.xPercent = (x / this.$refs.draggableContent.getBoundingClientRect().width) * 100;
            this.dragPosition.yPercent = (y / this.$refs.draggableContent.getBoundingClientRect().height) * 100;
            this.broadcastPosition();
        },
        setPositionPercent ({ xPercent, yPercent }) {
            // console.log(xPercent);
            this.dragPosition.xPercent = xPercent;
            this.dragPosition.yPercent = yPercent;
            // this.broadcastPosition();
        },
        broadcastPosition () {
            const { xPercent, yPercent } = this.dragPosition;
            const { x, y } = this.processPosition({ xPercent, yPercent});
            this.$emit('reposition', { x, y, xPercent, yPercent, id: this.itemId });
        },
    },
}
</script>

<style>

</style>