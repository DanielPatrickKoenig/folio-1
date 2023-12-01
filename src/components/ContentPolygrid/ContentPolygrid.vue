<template>
    <div 
        class="content-polypod"
        @mousemove="move"
        @touchemove="move"
        ref="podContainer"
    >
        <div 
            v-for="(slide, index) in slides"
            :key="index"
            class="polypod-container"
            :class="`polypod-container-${index}`"
            :style="{ 
                width: `${podSize.width}%`,
                height: `${podSize.height}%`,
            }"
        >
            <ReactivePolypod
                :points="points"
                :marker-x="markerForPodIndex(index).x"
                :marker-y="markerForPodIndex(index).y"
                :ref="`pod${index}`"
            >
                <slot
                    name="slide"
                    v-bind="{ slide, index }"
                />
                <template #content="{ points }">
                    <div
                        v-for="(point, i) in points"
                        :key="i"
                        class="reactive-point"
                        :class="`reactive-point-${i}`"
                        :style="{ left: `${point.x}%`, top: `${point.y}%` }"
                    >
                        
                    </div>
                </template>
            </ReactivePolypod>
        </div>
    </div>
</template>

<script>
import BaseContentComponent from '../BaseContentComponent.js';
import ReactivePolypod from '../Shared/ReactivePolypod.vue';
import { processPointerEvent } from '../../utils/Utilities';
export default {
    name: 'ContentPolygrid',
    extends: BaseContentComponent,
    components: {
        ReactivePolypod,
    },
    props: {
        points: {
            default: 6,
            required: false,
            type: Number,
        },
    },
    data () {
        return {
            marker: {
                x: 0,
                y: 0,
            },
            podPositions: this.slides.map(() => ({ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` })),
            podSize: {
                width: 20,
                height: 20,
            },
        }
    },
    computed: {
        podPosition () {
            return index => {
                let position = { x: 0, y: 0 };
                if (this.$refs[`pod${index}`] && this.$refs[`pod${index}`][0]) {
                    const podBounds = this.$refs[`pod${index}`][0].$el.getBoundingClientRect();
                    position = { x: podBounds.left, y: podBounds.top };
                }
                return position;
            };
        },
        podPositionPercentage () {
            return index => {
                const rawPosition = this.podPosition(index);
                let position = { x: 0, y: 0 };
                if (this.$refs.podContainer){
                    const containerBounds = this.$refs.podContainer.getBoundingClientRect();
                    position = {
                        x: (rawPosition.x / containerBounds.width) * 100,
                        y: (rawPosition.y / containerBounds.width) * 100,
                    }
                }
                return position;
            }
        },
        markerForPodIndex () {
            return index => {
                const rawPosition = this.podPosition(index);
                return {
                    x: this.marker.x - rawPosition.x,
                    y: this.marker.y - rawPosition.y - document.scrollingElement.scrollTop,
                };
            }
        },
        spaceBetweenPods () {
            return {
                hex: {
                    width: this.podSize.width * .5,
                    height: this.podSize.height * .5,
                },
            }
        },
        // podPositions () {
        //     let hProgress = 0;
        //     let vProgress = 0;
        //     let hOrientation = -1;
        //     let vOrientation = 1;
        //     let rowCount = 0;
        //     let peiceCount = 0;
        //     const hLimit = 6;
        //     return this.slides.map((item, index) => {
        //         hProgress = ((peiceCount));
        //         console.log('vProgress', vProgress);
        //         if (peiceCount > hLimit) {
        //             hProgress = 0;
        //             vOrientation *= -1;
        //             peiceCount = 0;
        //             rowCount++;
        //             vProgress = ((rowCount) + .5);
                    

        //         }
        //         hOrientation *= -1;
        //         const hVal = Math.floor(hProgress) * hOrientation;
        //         const vVal = Math.floor(vProgress) * hOrientation;
        //         const pos = this.getPodPosition(6, { x: hVal, y: vVal });
        //         peiceCount++;
        //         return pos;
        //     });
        // },
        
    },
    methods: {
        move (e) {
            const position = processPointerEvent(e);
            const containerBounds = this.$refs.podContainer.getBoundingClientRect();
            this.marker = {
                x: position.x,
                y: position.y,
                xPercent: ((position.x - containerBounds.left) / containerBounds.width) * 100,
                yPercent: ((position.y - containerBounds.top) / containerBounds.height) * 100,
             };
            //  console.log(this.marker);
        },
        // getPodPosition (sides, spaceFromCenter) {
        //     let shape = 'hex';
        //     switch (sides) {
        //         case 6: {
        //             shape = 'hex';
        //             break;
        //         }
        //         case 4: {
        //             shape = 'diamond';
        //             break;
        //         }
        //         case 3: {
        //             shape = 'triangle';
        //             break;
        //         }
        //     }
        //     const isOdd = spaceFromCenter.y / 2 === Math.round(spaceFromCenter.x / 2);
        //     return {
        //         x: 50 + ((spaceFromCenter.x - (isOdd ? .5 : 0)) * this.spaceBetweenPods[shape].width),
        //         y: 50 + (spaceFromCenter.y * this.spaceBetweenPods[shape].height),
        //     };
        // },
    },
}
</script>

<style>

</style>