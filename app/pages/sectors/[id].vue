<script setup lang="ts">
/**
 * PÁGINA DE REPORTE DE STOCK - VERSIÓN ESTABLE ANTIBLOQUEO
 */

const route = useRoute();
const toast = useToast();
const router = useRouter();
const isSaving = ref(false);

interface Sector {
    id: number;
    name: string;
    beds: number;
    umbrellas: number;
    sector_num: number;
}

// 1. Carga de datos con Lazy para evitar bloqueos de IPC/Vite
const {
    data: sector,
    pending,
    error,
} = useFetch<Sector>(`/api/sector/${route.params.id}`, {
    lazy: true,
    server: false, // Carga en cliente para mayor estabilidad en desarrollo
});

// 2. Estado del formulario
const form = reactive({
    beds_replaced: 0,
    beds_retired: 0,
    beds_broken: 0,
    umbrellas_replaced: 0,
    umbrellas_retired: 0,
    umbrellas_broken: 0,
});

// 3. Lógica de guardado
const handleSave = async () => {
    const hasChanges = Object.values(form).some((val) => val > 0);

    if (!hasChanges) {
        toast.add({
            title: "Sin cambios",
            description: "No has modificado ninguna cantidad.",
            color: "warning",
            icon: "i-heroicons-exclamation-triangle",
        });
        return;
    }

    isSaving.value = true;
    try {
        await $fetch("/api/stocks", {
            method: "POST",
            body: {
                ...form,
                sector_id: Number(route.params.id),
            },
        });

        toast.add({
            title: "¡Guardado!",
            description: "Inventario actualizado correctamente",
            icon: "i-heroicons-check-circle",
            color: "success",
        });

        router.push("/");
    } catch (err) {
        toast.add({
            title: "Error",
            description: "No se pudo guardar el registro",
            color: "error",
            icon: "i-heroicons-x-circle",
        });
    } finally {
        isSaving.value = false;
    }
};
</script>

<template>
    <UContainer class="py-4 pb-40">
        <UButton
            icon="i-heroicons-arrow-left"
            variant="ghost"
            color="neutral"
            class="mb-4"
            @click="router.back()"
        >
            VOLVER AL LISTADO DE SECTORES
        </UButton>

        <div v-if="pending" class="space-y-6">
            <USkeleton class="h-10 w-3/4" />
            <div class="grid grid-cols-2 gap-4">
                <USkeleton class="h-24 w-full" />
                <USkeleton class="h-24 w-full" />
            </div>
            <USkeleton class="h-64 w-full" />
        </div>

        <div v-else-if="error" class="text-center py-10">
            <UIcon
                name="i-heroicons-exclamation-circle"
                class="w-12 h-12 text-red-500 mb-2"
            />
            <p class="font-bold text-red-600">
                Error al cargar datos del sector
            </p>
            <UButton variant="link" @click="router.back()">Regresar</UButton>
        </div>

        <div v-else-if="sector" class="space-y-8">
            <header>
                <h1 class="text-3xl font-black text-gray-900 dark:text-white">
                    {{ sector.name }}
                </h1>
            </header>

            <div class="grid grid-cols-2 gap-4">
                <UCard
                    :ui="{ body: 'p-4 text-center' }"
                    class="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100"
                >
                    <UIcon
                        name="i-heroicons-square-3-stack-3d"
                        class="w-6 h-6 text-blue-500 mb-1"
                    />
                    <span class="block text-2xl font-black text-blue-700">{{
                        sector.beds
                    }}</span>
                    <span class="text-[10px] uppercase font-bold text-blue-500"
                        >HAMACAS Totales</span
                    >
                </UCard>

                <UCard
                    :ui="{ body: 'p-4 text-center' }"
                    class="bg-orange-50/50 dark:bg-orange-900/10 border-orange-100"
                >
                    <UIcon
                        name="i-heroicons-sun"
                        class="w-6 h-6 text-orange-500 mb-1"
                    />
                    <span class="block text-2xl font-black text-orange-700">{{
                        sector.umbrellas
                    }}</span>
                    <span
                        class="text-[10px] uppercase font-bold text-orange-500"
                        >SOMBRILLAS Totales</span
                    >
                </UCard>
            </div>

            <section class="space-y-4">
                <div
                    class="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2"
                >
                    <UIcon
                        name="i-heroicons-wrench-screwdriver"
                        class="text-gray-400 w-5 h-5"
                    />
                    <h2
                        class="font-bold text-gray-700 dark:text-gray-300 uppercase text-xs tracking-widest"
                    >
                        Gestión Hamacas
                    </h2>
                </div>

                <div class="grid grid-cols-1 gap-3">
                    <div
                        class="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
                    >
                        <div>
                            <p
                                class="font-bold text-gray-900 dark:text-white leading-none"
                            >
                                Repuestas / Nuevas
                            </p>
                            <span
                                class="text-[10px] text-green-600 font-black uppercase"
                                >(+) Sumar al total</span
                            >
                        </div>
                        <div class="flex items-center gap-2">
                            <UButton
                                icon="i-heroicons-minus"
                                color="neutral"
                                variant="subtle"
                                @click="
                                    form.beds_replaced > 0
                                        ? form.beds_replaced--
                                        : null
                                "
                            />
                            <input
                                v-model.number="form.beds_replaced"
                                type="number"
                                class="w-12 text-center font-black bg-transparent border-none focus:ring-0"
                            />
                            <UButton
                                icon="i-heroicons-plus"
                                color="primary"
                                @click="form.beds_replaced++"
                            />
                        </div>
                    </div>

                    <div
                        class="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
                    >
                        <div>
                            <p
                                class="font-bold text-gray-900 dark:text-white leading-none"
                            >
                                Retiradas
                            </p>
                            <span
                                class="text-[10px] text-gray-500 font-black uppercase"
                                >(-) Almacén / Guardado</span
                            >
                        </div>
                        <div class="flex items-center gap-2">
                            <UButton
                                icon="i-heroicons-minus"
                                color="neutral"
                                variant="subtle"
                                @click="
                                    form.beds_retired > 0
                                        ? form.beds_retired--
                                        : null
                                "
                            />
                            <input
                                v-model.number="form.beds_retired"
                                type="number"
                                class="w-12 text-center font-black bg-transparent border-none focus:ring-0"
                            />
                            <UButton
                                icon="i-heroicons-plus"
                                color="neutral"
                                @click="form.beds_retired++"
                            />
                        </div>
                    </div>

                    <div
                        class="flex items-center justify-between bg-red-50/50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/30"
                    >
                        <div>
                            <p
                                class="font-bold text-red-700 dark:text-red-400 leading-none"
                            >
                                Rotas / Dañadas
                            </p>
                            <span
                                class="text-[10px] text-red-500 font-black uppercase"
                                >(-) Restar del inventario</span
                            >
                        </div>
                        <div class="flex items-center gap-2">
                            <UButton
                                icon="i-heroicons-minus"
                                color="error"
                                variant="ghost"
                                @click="
                                    form.beds_broken > 0
                                        ? form.beds_broken--
                                        : null
                                "
                            />
                            <input
                                v-model.number="form.beds_broken"
                                type="number"
                                class="w-12 text-center font-black text-red-600 bg-transparent border-none focus:ring-0"
                            />
                            <UButton
                                icon="i-heroicons-plus"
                                color="error"
                                @click="form.beds_broken++"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section class="space-y-4">
                <div
                    class="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2"
                >
                    <UIcon
                        name="i-heroicons-sun"
                        class="text-gray-400 w-5 h-5"
                    />
                    <h2
                        class="font-bold text-gray-700 dark:text-gray-300 uppercase text-xs tracking-widest"
                    >
                        Gestión Sombrillas
                    </h2>
                </div>

                <div class="grid grid-cols-1 gap-3">
                    <div
                        class="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
                    >
                        <div>
                            <p
                                class="font-bold text-gray-900 dark:text-white leading-none"
                            >
                                Repuestas / Nuevas
                            </p>
                            <span
                                class="text-[10px] text-green-600 font-black uppercase"
                                >(+) Sumar</span
                            >
                        </div>
                        <div class="flex items-center gap-2">
                            <UButton
                                icon="i-heroicons-minus"
                                color="neutral"
                                variant="subtle"
                                @click="
                                    form.umbrellas_replaced > 0
                                        ? form.umbrellas_replaced--
                                        : null
                                "
                            />
                            <input
                                v-model.number="form.umbrellas_replaced"
                                type="number"
                                class="w-12 text-center font-black bg-transparent border-none focus:ring-0"
                            />
                            <UButton
                                icon="i-heroicons-plus"
                                color="primary"
                                @click="form.umbrellas_replaced++"
                            />
                        </div>
                    </div>

                    <div
                        class="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
                    >
                        <div>
                            <p
                                class="font-bold text-gray-900 dark:text-white leading-none"
                            >
                                Retiradas
                            </p>
                            <span
                                class="text-[10px] text-gray-500 font-black uppercase"
                                >(-) Almacén / Guardado</span
                            >
                        </div>
                        <div class="flex items-center gap-2">
                            <UButton
                                icon="i-heroicons-minus"
                                color="neutral"
                                variant="subtle"
                                @click="
                                    form.umbrellas_retired > 0
                                        ? form.umbrellas_retired--
                                        : null
                                "
                            />
                            <input
                                v-model.number="form.umbrellas_retired"
                                type="number"
                                class="w-12 text-center font-black bg-transparent border-none focus:ring-0"
                            />
                            <UButton
                                icon="i-heroicons-plus"
                                color="neutral"
                                @click="form.umbrellas_retired++"
                            />
                        </div>
                    </div>

                    <div
                        class="flex items-center justify-between bg-red-50/50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/30"
                    >
                        <div>
                            <p
                                class="font-bold text-red-700 dark:text-red-400 leading-none"
                            >
                                Rotas / Dañadas
                            </p>
                            <span
                                class="text-[10px] text-red-500 font-black uppercase"
                                >(-) Restar del inventario</span
                            >
                        </div>
                        <div class="flex items-center gap-2">
                            <UButton
                                icon="i-heroicons-minus"
                                color="error"
                                variant="ghost"
                                @click="
                                    form.umbrellas_broken > 0
                                        ? form.umbrellas_broken--
                                        : null
                                "
                            />
                            <input
                                v-model.number="form.umbrellas_broken"
                                type="number"
                                class="w-12 text-center font-black text-red-600 bg-transparent border-none focus:ring-0"
                            />
                            <UButton
                                icon="i-heroicons-plus"
                                color="error"
                                @click="form.umbrellas_broken++"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <div
                class="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-50"
            >
                <UButton
                    block
                    size="xl"
                    color="primary"
                    icon="i-heroicons-cloud-arrow-up"
                    :loading="isSaving"
                    @click="handleSave"
                >
                    Guardar Registro
                </UButton>
            </div>
        </div>
    </UContainer>
</template>
