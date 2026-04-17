<script setup lang="ts">
// Tipado (Podrías moverlo a un archivo de tipos global si lo usas mucho)
interface Sector {
    id: number;
    name: string;
    beds: number;
    umbrellas: number;
    sector_num?: number;
}

// 1. Carga de datos
const { data: sectors, pending } = await useFetch<Sector[]>("/api/sectors", {
    lazy: true,
    server: false,
});

// 2. Usuario y Sesión
const userName = useCookie("user_name").value || "Operario";

const handleLogout = () => {
    useCookie("user_name").value = null;
    useCookie("auth_session").value = null;
    navigateTo("/");
};

// 3. Navegación
const goToSector = (id: number) => {
    navigateTo(`/sectors/${id}`);
};
</script>

<template>
    <UContainer class="py-6 space-y-6">
        <header class="flex items-start justify-between">
            <div class="flex flex-col gap-1">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                    Hola, {{ userName }} 👋
                </h1>
                <p class="text-sm text-gray-500 font-medium">
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

        <div v-if="pending" class="grid gap-4">
            <USkeleton v-for="i in 4" :key="i" class="h-24 w-full rounded-xl" />
        </div>

        <div v-else-if="sectors?.length" class="grid gap-4">
            <SectorCard
                v-for="sector in sectors"
                :key="sector.id"
                :sector="sector"
                @click="goToSector"
            />
        </div>

        <UAlert
            v-else
            icon="i-heroicons-information-circle"
            color="secondary"
            variant="subtle"
            title="Sin sectores"
            description="No se encontraron sectores asignados a esta zona."
        />
    </UContainer>
</template>
