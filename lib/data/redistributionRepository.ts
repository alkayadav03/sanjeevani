import { TransferRecommendation, TransferStatus } from './types';
import { getStore, updateTransferStatus } from './mockDatabase';

export class RedistributionRepository {
  static getAll(): TransferRecommendation[] {
    return getStore().redistributions;
  }

  static getById(id: string): TransferRecommendation | undefined {
    return getStore().redistributions.find((r) => r.id === id);
  }

  static getActive(): TransferRecommendation[] {
    return getStore().redistributions.filter((r) => r.status !== 'RECEIVED' && r.status !== 'REJECTED');
  }

  static updateStatus(id: string, status: TransferStatus) {
    return updateTransferStatus(id, status);
  }

  static setAiRationale(id: string, rationale: string) {
    const transfer = getStore().redistributions.find((t) => t.id === id);
    if (transfer) {
      transfer.aiRationale = rationale;
    }
  }

  static getStats() {
    const transfers = getStore().redistributions;
    return {
      total: transfers.length,
      recommended: transfers.filter((t) => t.status === 'RECOMMENDED').length,
      approved: transfers.filter((t) => t.status === 'APPROVED').length,
      inTransit: transfers.filter((t) => t.status === 'IN_TRANSIT').length,
      received: transfers.filter((t) => t.status === 'RECEIVED').length,
      totalQuantityMoved: transfers
        .filter((t) => t.status === 'RECEIVED' || t.status === 'IN_TRANSIT')
        .reduce((acc, t) => acc + t.transferQuantity, 0),
    };
  }
}
