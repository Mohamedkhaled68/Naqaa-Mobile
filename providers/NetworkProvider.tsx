import NetworkStatusBanner from "@/components/NetworkStatusBanner";
import useNetworkStatus, { NetworkState } from "@/hooks/useNetworkStatus";
import React, { createContext, PropsWithChildren, useContext } from "react";

interface NetworkContextType extends NetworkState {
    checkConnection: () => Promise<boolean>;
    showNoConnectionAlert: () => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const useNetwork = () => {
    const context = useContext(NetworkContext);
    if (context === undefined) {
        throw new Error("useNetwork must be used within a NetworkProvider");
    }
    return context;
};

export const NetworkProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const networkStatus = useNetworkStatus();

    return (
        <NetworkContext.Provider value={networkStatus}>
            <NetworkStatusBanner />
            {children}
        </NetworkContext.Provider>
    );
};

export default NetworkProvider;
