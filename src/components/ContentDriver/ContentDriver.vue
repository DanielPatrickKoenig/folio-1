<template>
    <div>
        <div
            ref="stage"
            class="content-driver-stage"
        ></div>
    </div>
</template>

<script>
import BaseContentComponent from '../BaseContentComponent.js';
import { createScene } from '../../js/engine/index';
import { DataTypes } from '../../js/utils/Utilities';
export default {
    name: 'ContentDriver',
    extends: BaseContentComponent,
    mounted () {
        createScene(this.$refs.stage);
    },
}
</script>