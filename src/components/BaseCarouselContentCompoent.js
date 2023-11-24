import BaseContentComponent from './BaseContentComponent.js';
export default{
    extends: BaseContentComponent,
    data () {
        return {
            currentSlide: this.initialSlide,
            guidedDimensions: {
                width: 300,
                widthMobile: 300,
            },
            pointerStartData: {},
            dragging: false,
            moveCount: 0,
            moveDiffData: { x: 0, y: 0 },
        }
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
            return values;
        },
        down (e) {
            this.moveCount = 0;
            this.pointerStartData = this.processPointerEvent(e);
            this.dragging = true;
        },
        move (e) {
            if (this.dragging) {
                console.log(e);
                this.moveCount++;
                if (this.moveCount > 2) {
                    const moveData = this.processPointerEvent(e);
                    this.moveDiffData = { x: moveData.x - this.pointerStartData.x, y: moveData.y - this.pointerStartData.y };
                }
            }
        },
        up () {
            if (this.dragging) {
                if (Math.abs(this.moveDiffData.x) > this.guidedDimensions.width * .3) {
                    console.log('diff bigger');
                    this.navClicked(this.moveDiffData.x > 0 ? 'left' : 'right');
                }
                this.moveDiffData = { x: 0, y: 0 };
            }
            this.dragging = false;
            this.moveCount = 0;
        },
        navClicked (side, fromClick) {
            const slide =  this.currentSlide + (side === 'left' ? -1 : 1);
            this.goToSlide(slide);
            if (fromClick) this.$emit('slide-change-from-click', { slide });
        },
        goToSlide (slide) {
            if ([...new Array(this.slides.length).keys()].map(item => item.toString()).find(item => item === (slide - (this.slides.length * this.loopCount)).toString())) {
                const oldValue = this.currentSlide;
                this.currentSlide = slide;
                const newValue = this.currentSlide;
                this.$emit('slide-change', { newValue, oldValue });
            }
        },
    }
}