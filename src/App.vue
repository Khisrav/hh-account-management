<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAccountsStore } from "@/stores/useAccountsStore";

const accountsStore = useAccountsStore();
const { accounts } = storeToRefs(accountsStore);

// сохраняем в localStorage при монтировании
onMounted(() => {
	accountsStore.loadFromLocalStorage();
});

/**
 * Добавить учетку
 */
function addAccount() {
	accountsStore.addAccount();
}

/**
 * Удалитьучетку
 */
function removeAccount(index: number) {
	accountsStore.removeAccount(index);
}

/**
 * Обработчик смены типа учетки
 */
function onChangeType(index: number) {
	accountsStore.updateAccount(index, accounts.value[index]);
}

/**
 * Обработчик потери фокуса для полей
 */
function onBlurField(index: number) {
	accountsStore.updateAccount(index, accounts.value[index]);
}

// function hasLabelError(index: number) {
// 	return false;
// }
</script>

<template>
	<div>
		<div class="flex items-center gap-4 p-4">
			<h2 class="text-xl font-bold">Учетные записи</h2>

			<button @click="addAccount" type="button" class="flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
			</button>
		</div>
				
		<div class="p-4">
			<div class="grid grid-cols-12 gap-4 mb-4">
				<div class="col-span-3">
					<label>Метка (через ";")</label>
				</div>
	
				<div class="field col-span-2">
					<label>Тип записи</label>
				</div>
	
				<div class="field col-span-4">
					<label>Логин</label>
				</div>
	
				<div class="field col-span-3">
					<label>Пароль</label>
				</div>
	
				<div class="col-span-1">
				</div>
			</div>
						
			<div v-for="(account, index) in accounts" :key="account.id" class="grid grid-cols-12 gap-4 pb-4">
				<div class="col-span-3">
					<input type="text" v-model="account.labelRaw" :class="{ invalid: !account.isValid }" @blur="onBlurField(index)" placeholder="Пример: XXX; YYYYYY; ZZZZ" maxlength="50" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
				</div>
	
				<div class="field col-span-2">
					<select v-model="account.type" @change="onChangeType(index)" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
						<option value="LDAP">LDAP</option>
						<option value="Локальная">Локальная</option>
					</select>
				</div>
	
				<div class="field" :class="{ 'col-span-6': account.type === 'LDAP', 'col-span-3': account.type === 'Локальная' }">
					<input type="text" v-model="account.login" :class="{ invalid: !account.isValid && !account.login.trim() }" @blur="onBlurField(index)" placeholder="Введите логин" maxlength="100" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
				</div>
	
				<div v-if="account.type === 'Локальная'" class="field col-span-3">
					<input type="password" v-model="account.password" :class="{ invalid: !account.isValid && !account.password }" @blur="onBlurField(index)" placeholder="Введите пароль" maxlength="100" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
				</div>
	
				<div class="col-span-1">
					<button class="delete-btn" @click="removeAccount(index)">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
