<script setup lang="ts">
interface Sector {
    id: number;
    name: string;
    beds: number;
    umbrellas: number;
    sector_num?: number;
}

const { data: sectors, pending } = await useFetch<Sector[]>("/api/sectors");

// Obtenemos el nombre y preparamos el logout
const userName = useCookie("user_name").value || "Operario";

const handleLogout = () => {
    // Limpiamos las cookies
    useCookie("user_name").value = null;
    useCookie("auth_session").value = null;
    // Redirigimos a la raíz (Login)
    navigateTo("/");
};
</script>

<template>
    <UContainer class="py-6 space-y-6">
        <header class="flex items-start justify-between">
            <div class="flex flex-col gap-1">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                    Hola, {{ userName }} 👋
                </h1>
                <p class="text-sm text-gray-500">
                    Selecciona un sector para controlar stock
                </p>
            </div>

            <UButton
                icon="i-heroicons-arrow-left-on-rectangle"
                color="neutral"
                variant="ghost"
                @click="handleLogout"
            />
        </header>

        <div v-if="pending" class="space-y-4">
            <USkeleton v-for="i in 3" :key="i" class="h-24 w-full" />
        </div>

        <div v-else class="grid gap-4">
            <UCard
                v-for="sector in sectors"
                :key="sector.id"
                :ui="{ body: 'px-4 py-4' }"
                class="transition-active active:scale-95 cursor-pointer"
                @click="navigateTo(`/sectors/${sector.id}`)"
            >
                <div class="flex items-center justify-between">
                    <div class="flex flex-col">
                        <span
                            class="text-xs font-bold uppercase text-primary-500"
                        >
                            Sector {{ sector.sector_num }}
                        </span>
                        <span class="text-lg font-semibold">
                            {{ sector.name }}
                        </span>
                    </div>

                    <div class="flex gap-3 text-right">
                        <div class="flex flex-col items-center">
                            <UIcon
                                name="i-heroicons-square-3-stack-3d"
                                class="text-blue-500 w-5 h-5"
                            />
                            <span class="text-sm font-bold">{{
                                sector.beds
                            }}</span>
                            <span class="text-[10px] text-gray-400 uppercase"
                                >HAMACAS</span
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
                            <span class="text-[10px] text-gray-400 uppercase"
                                >SOMBRILLAS</span
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
        </div>

        <UAlert
            v-if="!pending && !sectors?.length"
            icon="i-heroicons-information-circle"
            color="secondary"
            variant="subtle"
            title="Sin sectores"
            description="No se encontraron sectores asignados a esta zona."
        />
    </UContainer>
</template>

<style scoped>
.transition-active {
    transition: transform 0.1s ease-in-out;
}
</style>
