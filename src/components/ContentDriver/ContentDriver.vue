<template>
    <div>
        <div
            ref="stage"
            class="content-driver-stage"
        ></div>
        <JoyStick
            @update-direction="updateDirection"
            @updating-ended="updatingEnded"
        />
        <svg
            ref="stage2D"
            class="content-driver-svg"
        >
            <path
                v-for="(wheel, i) in wheels"
                :key="i"
                :d="wheel"
                class="car-wheel"
            ></path>

            <path
                :d="frame"
                class="car-wheel"
            ></path>
        </svg>
    </div>
</template>

<script>
import BaseContentComponent from '../BaseContentComponent.js';
import { createScene } from '../../js/engine/index';
import { DataTypes, parseShapePoints } from '../../js/utils/Utilities';
import JoyStick from '../Shared/JoyStick.vue';
import CarScene from '../../js/classes/custom/CarScene.js';
export default {
    name: 'ContentDriver',
    extends: BaseContentComponent,
    components: {
        JoyStick,
    },
    data () {
        return {
            scene: null,
            speed: 2.5,
            wheels: [],
            frame: '',
        };
    },
    mounted () {
        this.scene = new CarScene(this.$refs.stage);

        this.scene.carController.updateHandler = (controller) => {
            this.wheels = controller.wheeleShapes.map(item => parseShapePoints(item, this.$refs.stage2D, true));
            // this.wheels = controller.wheeleShapes.map(item => item.map((_item, index) => `${index === 0 ? 'M' : 'L'} ${(_item.percent.x / 100) * this.$refs.stage2D.getBoundingClientRect().width} ${(_item.percent.y / 100) * this.$refs.stage2D.getBoundingClientRect().height}`).join(' ') + ' Z');
            this.frame = parseShapePoints(controller.frameShape, this.$refs.stage2D, true);
        };
    },
    methods: {
        updateDirection (e) {
            // console.log(e);
            // console.log(this.scene.getCarController());
            // this.scene.move(e.y);
            this.scene.carController.move(e.y * (-1 * this.speed));
            this.scene.carController.turn(e.x);
        },
        updatingEnded () {
            console.log('update end');
            this.scene.carController.move(0);
        },
    },
}
</script>