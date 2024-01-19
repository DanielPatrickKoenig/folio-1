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
    </div>
</template>

<script>
import BaseContentComponent from '../BaseContentComponent.js';
import { createScene } from '../../js/engine/index';
import { DataTypes } from '../../js/utils/Utilities';
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
        };
    },
    mounted () {
        this.scene = new CarScene(this.$refs.stage);
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