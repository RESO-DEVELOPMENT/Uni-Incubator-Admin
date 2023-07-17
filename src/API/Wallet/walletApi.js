import axiosClient from "../axiosClient";

const walletApi = {
    getSystemWallet: () => {
        const url = "wallets/wallet";
        return axiosClient.get(url);
    }
}

export default walletApi