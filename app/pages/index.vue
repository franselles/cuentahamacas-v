<script setup lang="ts">
// No aplicamos el middleware 'auth' aquí para evitar bucles,
// o bien dejamos que el middleware global maneje la redirección a /list si ya hay sesión.
const code = ref("");
const loading = ref(false);
const toast = useToast();

const handleLogin = async () => {
    if (code.value.length < 4) {
        toast.add({
            title: "Error",
            description: "Introduce los 4 dígitos",
            color: "error",
        });
        return;
    }

    loading.value = true;
    try {
        await $fetch("/api/login", {
            method: "POST",
            body: { code: code.value },
        });
        // El middleware se encargará de protegernos ahora que tenemos la cookie
        navigateTo("/list");
    } catch (err: any) {
        toast.add({
            title: "Acceso denegado",
            description: "Código de operario incorrecto",
            color: "error",
        });
        code.value = ""; // Limpiar para reintentar
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <UContainer class="h-screen flex flex-col justify-center">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-black text-gray-900 dark:text-white">
                Acceso Aplicación
            </h1>
            <p class="text-gray-500">Introduce tu código de 4 dígitos</p>
        </div>

        <UCard class="w-full max-w-sm mx-auto">
            <div class="space-y-6">
                <UInput
                    v-model="code"
                    type="password"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    maxlength="4"
                    size="xl"
                    placeholder="0 0 0 0"
                    autofocus
                    @keyup.enter="handleLogin"
                />

                <UButton
                    block
                    size="xl"
                    color="primary"
                    :loading="loading"
                    @click="handleLogin"
                >
                    Entrar al Sistema
                </UButton>
            </div>
        </UCard>

        <p class="text-center mt-8 text-xs text-gray-400">
            v0.0.3 - Control stocks hamacas y sombrillas
        </p>
        <p class="text-center mt-8 text-xs text-gray-400">en desarrollo</p>
        <p class="text-center mt-8 text-xs text-gray-400">R.A. BENIDORM S.L.</p>
    </UContainer>
</template>
