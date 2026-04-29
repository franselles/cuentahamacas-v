<script setup lang="ts">
interface Sector {
    id: number;
    name: string;
    beds: number;
    umbrellas: number;
    sector_num?: number;
}

defineProps<{
    sector: Sector;
}>();

const emit = defineEmits(["click"]);
</script>

<template>
    <UCard
        :ui="{ body: 'px-4 py-4' }"
        class="transition-active active:scale-95 cursor-pointer hover:border-primary-500/50"
        @click="emit('click', sector.id)"
    >
        <div class="flex items-center justify-between">
            <div class="flex flex-col">
                <span class="text-xs font-bold uppercase text-primary-500">
                    Sector {{ sector.sector_num }}
                </span>
                <span
                    class="text-lg font-semibold text-gray-900 dark:text-white"
                >
                    {{ sector.name }}
                </span>
            </div>

            <div class="flex gap-3 text-right">
                <div class="flex flex-col items-center">
                    <UIcon
                        name="i-heroicons-square-3-stack-3d"
                        class="text-blue-500 w-5 h-5"
                    />
                    <span class="text-sm font-bold">{{ sector.beds }}</span>
                    <span
                        class="text-[10px] text-gray-400 uppercase tracking-tighter"
                        >Hamacas</span
                    >
                </div>

                <div
                    class="flex flex-col items-center border-l pl-3 border-gray-100 dark:border-gray-800"
                >
                    <UIcon
                        name="i-heroicons-sun"
                        class="text-orange-500 w-5 h-5"
                    />
                    <span class="text-sm font-bold">{{
                        sector.umbrellas
                    }}</span>
                    <span
                        class="text-[10px] text-gray-400 uppercase tracking-tighter"
                        >Sombrillas</span
                    >
                </div>

                <div class="flex items-center ml-1">
                    <UIcon
                        name="i-heroicons-chevron-right"
                        class="text-gray-300 w-4 h-4"
                    />
                </div>
            </div>
        </div>
    </UCard>
</template>

<style scoped>
.transition-active {
    transition: transform 0.1s ease-in-out;
}
</style>
