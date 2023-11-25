<template>
    <div class="content-scrap-book">
        <div class="csa-board">
            <DraggableContent
                v-for="(slide, index) in slides"
                :key="index"
                class="csa-slide"
            >
                <slot
                    name="slide"
                    v-bind="{ slide, index }"
                >
                    Slide {{ index }}
                </slot>
            </DraggableContent>

        </div>

    </div>
</template>

<script>
import BaseContentComponent from '../BaseContentComponent.js';
import { DataTypes } from '../../utils/Utilities';
import DraggableContent from '../shared/DraggableContent.vue';
export default {
    name: 'ContentScrapBook',
    extends: BaseContentComponent,
    components: {
        DraggableContent,
    },
}
</script>

<style>

</style>