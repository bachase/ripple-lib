// flow is disabled for this file until support for requiring json is added:
// https://github.com/facebook/flow/issues/167
'use strict' // eslint-disable-line strict
const _ = require('lodash')
const assert = require('assert')
const ValidationError = require('./errors').ValidationError

function loadValidators() {
  // listed explicitly for webpack (instead of scanning schemas directory)
  const validators = [
    require('../../gen/validators/objects/tx-json'),
    require('../../gen/validators/objects/tx-type'),
    require('../../gen/validators/objects/hash128'),
    require('../../gen/validators/objects/hash256'),
    require('../../gen/validators/objects/sequence'),
    require('../../gen/validators/objects/signature'),
    require('../../gen/validators/objects/issue'),
    require('../../gen/validators/objects/ledgerversion'),
    require('../../gen/validators/objects/max-adjustment'),
    require('../../gen/validators/objects/memo'),
    require('../../gen/validators/objects/memos'),
    require('../../gen/validators/objects/public-key'),
    require('../../gen/validators/objects/uint32'),
    require('../../gen/validators/objects/value'),
    require('../../gen/validators/objects/source-adjustment'),
    require('../../gen/validators/objects/destination-adjustment'),
    require('../../gen/validators/objects/tag'),
    require('../../gen/validators/objects/lax-amount'),
    require('../../gen/validators/objects/lax-lax-amount'),
    require('../../gen/validators/objects/min-adjustment'),
    require('../../gen/validators/objects/source-exact-adjustment'),
    require('../../gen/validators/objects/destination-exact-adjustment'),
    require('../../gen/validators/objects/tx-hash'),
    require('../../gen/validators/objects/address'),
    require('../../gen/validators/objects/adjustment'),
    require('../../gen/validators/objects/quality'),
    require('../../gen/validators/objects/amount'),
    require('../../gen/validators/objects/amount-base'),
    require('../../gen/validators/objects/balance'),
    require('../../gen/validators/objects/blob'),
    require('../../gen/validators/objects/currency'),
    require('../../gen/validators/objects/signed-value'),
    require('../../gen/validators/objects/orderbook'),
    require('../../gen/validators/objects/instructions'),
    require('../../gen/validators/objects/settings'),
    require('../../gen/validators/specifications/settings'),
    require('../../gen/validators/specifications/payment'),
    require('../../gen/validators/specifications/escrow-cancellation'),
    require('../../gen/validators/specifications/order-cancellation'),
    require('../../gen/validators/specifications/order'),
    require('../../gen/validators/specifications/escrow-execution'),
    require('../../gen/validators/specifications/escrow-creation'),
    require('../../gen/validators/specifications/payment-channel-create'),
    require('../../gen/validators/specifications/payment-channel-fund'),
    require('../../gen/validators/specifications/payment-channel-claim'),
    require('../../gen/validators/specifications/trustline'),
    require('../../gen/validators/output/sign'),
    require('../../gen/validators/output/submit'),
    require('../../gen/validators/output/get-account-info'),
    require('../../gen/validators/output/get-balances'),
    require('../../gen/validators/output/get-balance-sheet'),
    require('../../gen/validators/output/get-ledger'),
    require('../../gen/validators/output/get-orderbook'),
    require('../../gen/validators/output/get-orders'),
    require('../../gen/validators/output/order-change'),
    require('../../gen/validators/output/get-payment-channel'),
    require('../../gen/validators/output/prepare'),
    require('../../gen/validators/output/ledger-event'),
    require('../../gen/validators/output/get-paths'),
    require('../../gen/validators/output/get-server-info'),
    require('../../gen/validators/output/get-settings'),
    require('../../gen/validators/output/orderbook-orders'),
    require('../../gen/validators/output/outcome'),
    require('../../gen/validators/output/get-transaction'),
    require('../../gen/validators/output/get-transactions'),
    require('../../gen/validators/output/get-trustlines'),
    require('../../gen/validators/output/sign-payment-channel-claim'),
    require('../../gen/validators/output/verify-payment-channel-claim'),
    require('../../gen/validators/input/get-balances'),
    require('../../gen/validators/input/get-balance-sheet'),
    require('../../gen/validators/input/get-ledger'),
    require('../../gen/validators/input/get-orders'),
    require('../../gen/validators/input/get-orderbook'),
    require('../../gen/validators/input/get-paths'),
    require('../../gen/validators/input/get-payment-channel'),
    require('../../gen/validators/input/api-options'),
    require('../../gen/validators/input/get-settings'),
    require('../../gen/validators/input/get-account-info'),
    require('../../gen/validators/input/get-transaction'),
    require('../../gen/validators/input/get-transactions'),
    require('../../gen/validators/input/get-trustlines'),
    require('../../gen/validators/input/prepare-payment'),
    require('../../gen/validators/input/prepare-order'),
    require('../../gen/validators/input/prepare-trustline'),
    require('../../gen/validators/input/prepare-order-cancellation'),
    require('../../gen/validators/input/prepare-settings'),
    require('../../gen/validators/input/prepare-escrow-creation'),
    require('../../gen/validators/input/prepare-escrow-cancellation'),
    require('../../gen/validators/input/prepare-escrow-execution'),
    require('../../gen/validators/input/prepare-payment-channel-create'),
    require('../../gen/validators/input/prepare-payment-channel-fund'),
    require('../../gen/validators/input/prepare-payment-channel-claim'),
    require('../../gen/validators/input/compute-ledger-hash'),
    require('../../gen/validators/input/sign'),
    require('../../gen/validators/input/submit'),
    require('../../gen/validators/input/generate-address'),
    require('../../gen/validators/input/sign-payment-channel-claim'),
    require('../../gen/validators/input/verify-payment-channel-claim'),
    require('../../gen/validators/input/combine')
  ]

  return _.keyBy(validators, o => o.schema.title)
}

const validators = loadValidators()

function schemaValidate(schemaName: string, object: any): void {
  if(schemaName in validators)
  {
    const isValid = validators[schemaName](object)
    if (!isValid) {
      throw new ValidationError(validators[schemaName].errors)
    }
  }
  else{
      throw new ValidationError("Unknown schema " + schemaName)
  }
}

module.exports = {
  schemaValidate
}
