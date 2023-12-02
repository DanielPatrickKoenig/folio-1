<template>
    <div
        class="content-polypod-shell"
        ref="shell"
    >
        <div
            class="content-marker"
            aria-hidden="true"
            ref="marker"
        />
        <DraggableContent
            :left="0"
            :top="0"
        >
            <div 
                class="content-polypod"
                ref="podContainer"
            >
                <div 
                    v-for="(slide, index) in slides"
                    :key="index"
                    class="polypod-container"
                    :class="`polypod-container-${index}`"
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
        </DraggableContent>
    </div>
</template>

<script>
import BaseContentComponent from '../BaseContentComponent.js';
import ReactivePolypod from '../Shared/ReactivePolypod.vue';
import { processPointerEvent } from '../../utils/Utilities';
import DraggableContent from '../shared/DraggableContent.vue';
export default {
    name: 'ContentPolygrid',
    extends: BaseContentComponent,
    components: {
        ReactivePolypod,
        DraggableContent,
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
        markerForPodIndex () {
            return index => {
                const rawPosition = this.podPosition(index);
                return {
                    x: this.getCenterPoint().x - rawPosition.x,
                    y: this.getCenterPoint().y - rawPosition.y - document.scrollingElement.scrollTop,
                };
            }
        },
        
    },
    methods: {
        getCenterPoint () {
            let center = { x: 0, y: 0 };
            if (this.$refs.marker) {
                const bounds = this.$refs.marker.getBoundingClientRect();
                center = {
                    x: bounds.left,
                    y: bounds.top,
                };
            }
            return center;
        },
    },
}
</script>

<style>

</style>