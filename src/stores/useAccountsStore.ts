import { defineStore } from "pinia";
import { ref, watch } from "vue";

export interface LabelItem { text: string; }
export type AccountType = "LDAP" | "Локальная";
export interface Account {
    id: number;
    labelRaw: string; 
    labels: LabelItem[]; 
    type: AccountType; 
    login: string; 
    password: string | null; 
    isValid: boolean; 
}

export const useAccountsStore = defineStore("accounts", () => {
    const accounts = ref<Account[]>([]);

    // Загружаем из localStorage
    function loadFromLocalStorage() {
        const data = localStorage.getItem("accounts");
        if (data) {
            try {
                accounts.value = JSON.parse(data);
            } catch (e) {
                accounts.value = [];
            }
        }
    }

    // Сохраняем в localStorage при изменении массива учеток
    watch(
        accounts,
        (newVal) => {
            localStorage.setItem("accounts", JSON.stringify(newVal));
        },
        { deep: true }
    );

    // Добавить учетку
    function addAccount() {
        accounts.value.push({
            id: Date.now(),
            labelRaw: "",
            labels: [],
            type: "Локальная",
            login: "",
            password: "",
            isValid: false,
        });
    }

	// Удалить учетку по индексу
    function removeAccount(index: number) {
        accounts.value.splice(index, 1);
    }

    
	// Обновляем учетку по индексу
    function updateAccount(index: number, updated: Account) {
        // Базовая валидация
        let isValid = true;

        // Проверка обязательных полей
        if (!updated.login.trim()) {
            isValid = false;
        }
        if (updated.type === "Локальная" && !updated.password) {
            isValid = false;
        }

        // Парсинг поля "Метка"
        const splitted = updated.labelRaw
            .split(";")
            .map((item) => item.trim())
            .filter(Boolean);

        const labels = splitted.map((text) => ({ text }));

        // Если тип LDAP, то пароль null
        const password = updated.type === "LDAP" ? null : updated.password;

        // Обновляем запись в массиве
        accounts.value[index] = {
            ...updated,
            labels,
            password,
            isValid,
        };
    }

    return {
        accounts,
        loadFromLocalStorage,
        addAccount,
        removeAccount,
        updateAccount,
    };
});
