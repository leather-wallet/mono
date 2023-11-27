import { PaymentTypes } from '@btckit/types';
import {
  BitcoinAccount,
  ecdsaPublicKeyToSchnorr,
  whenPaymentType,
} from '@leather-wallet/bitcoin/src/bitcoin.utils';
import { NetworkConfiguration } from '@leather-wallet/constants';
import { Versions } from '@scure/bip32';
import { P2Ret } from '@scure/btc-signer';
import { bytesToHex } from '@stacks/common';
import { TransactionPayload } from '@stacks/connect';
import { Signer } from 'utils/bitcoin/bitcoin-signer';

import { getCurrentAccountNativeSegwitIndexZeroSigner } from './utils/bitcoin/native-segwit-account.hooks';
import { getCurrentAccountTaprootIndexZeroSigner } from './utils/bitcoin/taproot-account.hooks';
import { getCurrentStacksAccount } from './utils/stacks/stacks-account';
import { StacksAccount } from './utils/stacks/stacks-account.models';

interface BitcoinAccountResponse {
  symbol: string;
  type: string;
  address: string;
  publicKey: string;
  tweakedPublicKey?: string;
  derivationPath: string;
}

export function getAddresses({
  signatureIndex,
  currentAccountIndex,
  currentNetwork,
  hasSwitchedAccounts,
  bitcoinAccounts,
  stacksAccounts,
  transactionPayload,
  bitcoinExtendedPublicKeyVersions,
}: {
  signatureIndex: number | undefined;
  currentAccountIndex: number;
  currentNetwork: NetworkConfiguration;
  hasSwitchedAccounts: boolean;
  bitcoinAccounts: (BitcoinAccount | undefined)[];
  stacksAccounts: StacksAccount[];
  transactionPayload: TransactionPayload | null;
  bitcoinExtendedPublicKeyVersions: Versions | undefined;
}) {
  function mapBitcoinAccountToSigner(bitcoinAccount: BitcoinAccount | undefined) {
    if (!bitcoinAccount) return undefined;

    // get bitcoin signer
    const bitcoinSigner = whenPaymentType(bitcoinAccount.type)({
      p2wpkh: getCurrentAccountNativeSegwitIndexZeroSigner({
        currentAccountIndex,
        nativeSegwitAccount: bitcoinAccount,
        bitcoinExtendedPublicKeyVersions,
      }),
      p2tr: getCurrentAccountTaprootIndexZeroSigner({
        currentAccountIndex,
        taprootAccount: bitcoinAccount,
        currentNetwork,
        bitcoinExtendedPublicKeyVersions,
      }),
      // TODO: Not supported
      'p2wpkh-p2sh': undefined,
      p2pkh: undefined,
      p2sh: undefined,
    });

    if (!bitcoinSigner) return;

    return { ...bitcoinSigner, type: bitcoinAccount.type };
  }

  function mapSignerToResponse(
    bitcoinSigner: (Signer<P2Ret> & { type: PaymentTypes }) | undefined
  ) {
    if (!bitcoinSigner) return;

    // get bitcoin account response
    return whenPaymentType(bitcoinSigner.type)({
      p2wpkh: {
        symbol: 'BTC',
        type: 'p2wpkh',
        address: bitcoinSigner.address,
        publicKey: bytesToHex(bitcoinSigner.publicKey),
        derivationPath: bitcoinSigner.derivationPath,
      },
      p2tr: {
        symbol: 'BTC',
        type: 'p2tr',
        address: bitcoinSigner.address,
        publicKey: bytesToHex(bitcoinSigner.publicKey),
        tweakedPublicKey: bytesToHex(ecdsaPublicKeyToSchnorr(bitcoinSigner.publicKey)),
        derivationPath: bitcoinSigner.derivationPath,
      },
      // TODO: Not supported
      'p2wpkh-p2sh': undefined,
      p2pkh: undefined,
      p2sh: undefined,
    });
  }

  function filterBitcoinResponses(bitcoinAccountResponse: BitcoinAccountResponse | undefined) {
    return bitcoinAccountResponse != null;
  }

  const bitcoinAccountResponses: (BitcoinAccountResponse | undefined)[] = bitcoinAccounts
    .map(mapBitcoinAccountToSigner)
    .map(mapSignerToResponse)
    .filter(filterBitcoinResponses);

  const stacksAccount = getCurrentStacksAccount({
    currentAccountIndex,
    stacksAccounts,
    transactionPayload,
    hasSwitchedAccounts,
    signatureIndex,
  });

  const stacksAddressResponse = {
    symbol: 'STX',
    address: stacksAccount?.address ?? '',
  };

  return {
    stacksAddressResponse,
    bitcoinAccountResponses,
  };
}
