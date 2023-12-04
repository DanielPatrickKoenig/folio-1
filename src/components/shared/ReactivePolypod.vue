<template>
    <div 
        class="reactive-polypod"
        ref="pod"
    >
        <slot
            name="content"
            v-bind="{ podCenter: centerPoint }"
        />
        <slot
            name="points"
            v-bind="{ points: reactivePoints }"
        />
        <!-- <div :style="{ position: 'absolute', width: '3%', height: '3%', 'background-color': '#000000', left: `${centerPoint.x}%`, top: `${centerPoint.y}%` }" /> -->
    </div>
</template>

<script>
import jstrig from 'jstrig'
export default {
    props: {
        markerX: {
            required: true,
            type: Number,
        },
        markerY: {
            required: true,
            type: Number,
        },
        points: {
            default: 3,
            required: false,
            type: Number,
        },
        radius: {
            default: 50,
            required: false,
            type: Number,
        }
    },
    data () {
        return {
            pointList: [],
            center: {
                x: 50,
                y: 50,
            },
            minDist: 65,
        };
    },
    computed: {
        staticPoints () {
            return [...new Array(this.points).keys()].map(item => this.getPointPosition((360 / this.points) * item));
        },
        reactivePoints () {
            return this.staticPoints.map(item => this.getReactivePosition(item));
        },
        podSize () {
            console.log(this.$refs);
            return this.$refs.pod ? this.$refs.pod.getBoundingClientRect() : { width: 0, height: 0 };
        },
        markerPercentages () {
            
            return {
                x: (this.markerX / this.$refs.pod?.getBoundingClientRect().width) * 100,
                y: (this.markerY / this.$refs.pod?.getBoundingClientRect().height) * 100,
            };
        },
        centerPoint () {
            const center = { x: 0, y: 0 };
            switch (this.points) {
                case 6:{
                    const topPoint = this.reactivePoints[0];
                    const bottomPoint = this.reactivePoints[3];
                    const leftPoint = {
                        x: this.reactivePoints[5].x + ((this.reactivePoints[4].x - this.reactivePoints[5].x) / 2),
                        y: this.reactivePoints[5].y + ((this.reactivePoints[4].y - this.reactivePoints[5].y) / 2),
                    };
                    const rightPoint = {
                        x: this.reactivePoints[1].x + ((this.reactivePoints[2].x - this.reactivePoints[1].x) / 2),
                        y: this.reactivePoints[1].y + ((this.reactivePoints[2].y - this.reactivePoints[1].y) / 2),
                    };
                    const { x, y } = jstrig.intersection(topPoint, rightPoint, bottomPoint, leftPoint);
                    center.x = x;
                    center.y = y;
                    break;
                }
            }
            return center;
        },
    },
    methods: {
        getPointPosition (angle) {
            return {
                x: jstrig.orbit(this.center.x, this.radius, angle, 'cos'),
                y: jstrig.orbit(this.center.y, this.radius, angle, 'sin'),
            };
        },
        getReactivePosition (point) {
            const dist = jstrig.distance(point, this.markerPercentages);
            const position = { ...point };
            if (dist < this.minDist) {
                const angle = jstrig.angle(this.markerPercentages, point);
                position.x = jstrig.orbit(position.x, this.minDist - dist, angle, 'cos');
                position.y = jstrig.orbit(position.y, this.minDist - dist, angle, 'sin');
            }
            return position;
        },
    },
}
</script>

<style>

</style>