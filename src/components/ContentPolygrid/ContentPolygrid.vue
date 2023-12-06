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
            ref="dragger"
            :left="0"
            :top="0"
            @position-complete="positionComplete"
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
                        :angle-offset="angleOffset(index)"
                        :ref="`pod${index}`"
                    >
                        <template #content="{ podCenter }">
                            <div
                                class="polypod-content-container"
                                :class="{ active: closestIndex === index && Math.round(podCenter.x) === 50 && Math.round(podCenter.y) === 50 }"
                                :style="{ left: `${podCenter.x}%`, top: `${podCenter.y}%` }"
                            >
                                <slot
                                    name="slide"
                                    v-bind="{ slide, index }"
                                />
                            </div>
                        </template>
                        
                        <template #points="{ points }">
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
import jstrig from 'jstrig';
import gsap from 'gsap';
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
            closestIndex: -1,
        }
    },
    computed: {
        podPosition () {
            return (index, fromCenter) => {
                let position = { x: 0, y: 0 };
                if (this.$refs[`pod${index}`] && this.$refs[`pod${index}`][0]) {
                    const podBounds = this.$refs[`pod${index}`][0].$el.getBoundingClientRect();
                    position = { 
                        x: podBounds.left + (fromCenter ? podBounds.width / 2 : 0), 
                        y: podBounds.top + (fromCenter ? podBounds.height / 2 : 0), 
                    };
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
        angleOffset () {
            return index => this.points === 3 && index % 2 === 0 ? 180 : 0;
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
        getSortedDistances () {
            const centerPoint = this.getCenterPoint();
            const distList = this.slides.map((item, index) => ({ distance: jstrig.distance(this.podPosition(index, true), centerPoint), index}));
            return distList.sort((a, b) => a.distance - b.distance);
        },
        positionComplete (e) {
            const closestIndex = this.getSortedDistances()[0].index;
            this.closestIndex = closestIndex;
            const closestPodPosition = this.podPosition(closestIndex, true);
            const containerBounds = this.$refs.shell.getBoundingClientRect();
            const posDiff = { x: closestPodPosition.x - (containerBounds.left + (containerBounds.width / 2)), y: (containerBounds.top + (containerBounds.height / 2)) - closestPodPosition.y };
            const draggerPos = { ...e };
            const targetPosition = { x: (e.x) - posDiff.x, y: (e.y) + posDiff.y };
            gsap.to(draggerPos, {
                ...targetPosition,
                duration: .5,
                onUpdate: () => {
                    this.$refs.dragger.setPosition({ x: draggerPos.x, y: draggerPos.y });
                },
            });
            
        },
    },
}
</script>

<style>

</style>