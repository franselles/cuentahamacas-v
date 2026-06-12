<script setup lang="ts">
interface Sector {
    id: number;
    name: string;
    beds: number;
    max_beds: number;
    max_umbrellas: number;
    umbrellas: number;
    sector_num?: number;
}

const { data: sectors, pending } = await useFetch<Sector[]>("/api/sectors", {
    lazy: true,
    server: false,
});

const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
});

const triggerPrint = () => {
    window.print();
};
</script>

<template>
    <UContainer
        class="py-6 space-y-6 max-w-4xl print:max-w-full print:p-0 print:bg-white print:text-black"
    >
        <header
            class="flex items-center justify-between print:hidden bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
        >
            <div>
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">
                    Vista de Impresión
                </h1>
            </div>
            <div class="flex gap-2">
                <UButton
                    icon="i-heroicons-arrow-left"
                    variant="ghost"
                    color="neutral"
                    @click="navigateTo('/list')"
                >
                    Volver
                </UButton>
                <UButton
                    icon="i-heroicons-printer"
                    color="primary"
                    @click="triggerPrint"
                >
                    Imprimir ahora
                </UButton>
            </div>
        </header>

        <div v-if="pending" class="space-y-4 print:hidden">
            <USkeleton class="h-8 w-1/3" />
            <USkeleton v-for="i in 3" :key="i" class="h-12 w-full" />
        </div>

        <article
            v-else-if="sectors?.length"
            class="print-clean-sheet bg-white text-black p-2 print:p-0"
        >
            <div
                class="border-b-4 border-black pb-3 mb-6 flex justify-between items-end"
            >
                <div>
                    <h1
                        class="text-2xl font-black uppercase tracking-tight text-black print:text-black"
                    >
                        HAMACAS — INVENTARIO
                    </h1>
                    <p
                        class="text-xs text-gray-600 uppercase font-bold tracking-wider print:text-black"
                    >
                        Reporte de Estado de Material en playa - R.A. BENIDORM
                        S.L.
                    </p>
                </div>
                <div class="text-right text-xs text-black font-medium">
                    <p><strong>Fecha emisión:</strong> {{ currentDate }}</p>
                    <p><strong>Total Sectores:</strong> {{ sectors.length }}</p>
                </div>
            </div>

            <table
                class="w-full text-left table-fixed border-collapse text-sm text-black print:text-black"
            >
                <thead>
                    <tr
                        class="border-b-2 border-black bg-gray-100 print:bg-gray-200 text-xs font-bold uppercase text-black"
                    >
                        <th
                            class="py-2 px-2 w-24 border border-black text-black"
                        >
                            Sector
                        </th>
                        <th class="py-2 px-3 border border-black text-black">
                            Ubicación / Zona
                        </th>
                        <th
                            class="py-2 px-2 text-center border border-black text-black w-28"
                        >
                            Hamacas
                        </th>
                        <th
                            class="py-2 px-2 text-center border border-black text-black w-24 bg-gray-50/50"
                        >
                            MAX Ham.
                        </th>
                        <th
                            class="py-2 px-2 text-center border border-black text-black w-28"
                        >
                            Sombrillas
                        </th>
                        <th
                            class="py-2 px-2 text-center border border-black text-black w-24 bg-gray-50/50"
                        >
                            MAX Som.
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="sector in sectors"
                        :key="sector.id"
                        class="border-b border-black print:border-black break-inside-avoid text-black"
                    >
                        <td
                            class="py-2 px-2 border border-black font-mono font-bold text-sm text-black"
                        >
                            Nº {{ sector.sector_num || sector.id }}
                        </td>
                        <td
                            class="py-2 px-3 border border-black font-bold text-sm text-black uppercase"
                        >
                            {{ sector.name }}
                        </td>
                        <td
                            class="py-2 px-2 border border-black text-center font-black text-base text-black"
                        >
                            {{ sector.beds }}
                        </td>
                        <td
                            class="py-2 px-2 border border-black text-center text-gray-700 bg-gray-50/50 text-sm print:text-black"
                        >
                            {{ sector.max_beds }}
                        </td>
                        <td
                            class="py-2 px-2 border border-black text-center font-black text-base text-black"
                        >
                            {{ sector.umbrellas }}
                        </td>
                        <td
                            class="py-2 px-2 border border-black text-center text-gray-700 bg-gray-50/50 text-sm print:text-black"
                        >
                            {{ sector.max_umbrellas }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </article>
    </UContainer>
</template>

<style scoped>
/* Reseteo agresivo inyectado directamente en el motor de renderizado de la impresora */
@media print {
    /* Forzamos al navegador a ignorar el modo oscuro del sistema o de la app */
    :global(html),
    :global(body) {
        background-color: #ffffff !important;
        color: #000000 !important;
        font-family:
            "Courier New", Courier, monospace !important; /* Estilo reporte clásico e infalible */
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    /* Forzar que todos los textos pasen a ser negro tinta absoluta */
    span,
    p,
    h1,
    td,
    th,
    div {
        color: #000000 !important;
        text-shadow: none !important;
        box-shadow: none !important;
    }

    /* Destruir cualquier contenedor UI sobrante de Nuxt */
    :global(.max-w-4xl) {
        max-width: 100% !important;
        width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
    }

    .break-inside-avoid {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }
}
</style>
