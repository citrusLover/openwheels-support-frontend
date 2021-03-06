'use strict';

angular.module('openwheels.invoice2', [
  'openwheels.invoice2.invoiceGroup.list',
  'openwheels.invoice2.invoiceGroup.show',
  'openwheels.invoice2.invoice.edit',
  'openwheels.invoice2.invoice.debtor.list',
  'openwheels.invoice2.invoice.creditor.list',
  'openwheels.invoice2.voucher.list',
  'openwheels.invoice2.payment.list',
  'openwheels.invoice2.payout.list',
  'openwheels.invoice2.account.list'
])

.config(function config($stateProvider) {

  $stateProvider.state('root.invoice2', {
    abstract: true,
    url: '/invoice2',
    views: {
      'main@': {
        template: '<div ui-view></div>'
      }
    }
  });

  $stateProvider.state('root.invoice2.invoiceGroup', {
    abstract: true,
    url: '/invoice-groups',
    views: {
      'main@': {
        template: '<div ui-view></div>'
      }
    }
  });

  $stateProvider.state('root.invoice2.invoiceGroup.list', {
    url: '?status&from&until&max',
    controller: 'v2_InvoiceGroupListController',
    templateUrl: 'invoice2/invoiceGroup/list/v2_invoiceGroupList.tpl.html',
    data: {pageTitle: 'Invoice groups'},
    resolve: {
      ungroupedReceivedInvoices: function () {
        return null;
      },
      ungroupedSentInvoices: function () {
        return null;
      },
      accounts: function () {
        return null;
      },
      invoiceGroups: ['$stateParams', 'paymentService', function ($stateParams, paymentService) {
        var req = $stateParams;
        var params = {};
        if (req.status) { params.status = req.status; }
        if (req.from)   { params.from   = req.from; }
        if (req.until)  { params.until  = req.until; }
        if (req.max)    {
          try {
            params.max = parseInt(req.max);
          } catch (e) {
          }
        }
        return paymentService.getInvoiceGroups(params);
      }]
    }
  });

  $stateProvider.state('root.invoice2.invoiceGroup.show', {
    url: '/:invoiceGroupId',
    controller: 'v2_InvoiceGroupShowController',
    templateUrl: 'invoice2/invoiceGroup/show/v2_invoiceGroupShow.tpl.html',
    data: {pageTitle: 'Invoice group'},
    resolve: {
      invoiceGroup: ['$stateParams', 'invoice2Service', function ($stateParams, invoice2Service) {
        var params = {
          invoiceGroup: $stateParams.invoiceGroupId,
          groupByBooking: true,
        };
        return invoice2Service.getInvoiceGroup(params);
      }]
    }
  });

  $stateProvider.state('root.invoice2.invoice', {
    abstract: true,
    url: '/invoices',
    views: {
      'main@': {
        template: '<div ui-view></div>'
      }
    }
  });

  $stateProvider.state('root.invoice2.invoice.edit', {
    url: '/:invoiceId/edit',
    controller: 'InvoiceEditController',
    templateUrl: 'invoice2/invoice/edit/invoiceEdit.tpl.html',
    data: {
      pageTitle: 'Edit invoice'
    },
    resolve: {
      invoice: ['$stateParams', 'invoice2Service', function ($stateParams, invoice2Service) {
        return invoice2Service.get({ invoice: $stateParams.invoiceId });
      }]
    }
  });

  $stateProvider.state('root.invoice2.invoice.create', {
    url: '/create?person',
    controller: 'InvoiceEditController',
    templateUrl: 'invoice2/invoice/edit/invoiceEdit.tpl.html',
    data: {
      pageTitle: 'Invoice'
    },
    resolve: {
      invoice: function () {
        return null;
      }
    }
  });

  $stateProvider.state('root.invoice2.invoice.debtors-list', {
    url: '/debtors?date',
    controller: 'v2_InvoiceDebtorListController',
    templateUrl: 'invoice2/invoice/list/v2_invoiceDebtorList.tpl.html',
    data: {pageTitle: 'Invoices - Debtors'},
    resolve: {
      invoices: ['$stateParams', 'invoice2Service', function ($stateParams, invoice2Service) {
        var req = $stateParams;
        var params = {};
        if (req.date) { params.date = req.date; }
        return invoice2Service.getDebtors(params);
      }]
    }
  });

  $stateProvider.state('root.invoice2.invoice.creditors-list', {
    url: '/creditors?date',
    controller: 'v2_InvoiceCreditorListController',
    templateUrl: 'invoice2/invoice/list/v2_invoiceCreditorList.tpl.html',
    data: {pageTitle: 'Invoices - Creditors'},
    resolve: {
      invoices: ['$stateParams', 'invoice2Service', function ($stateParams, invoice2Service) {
        var req = $stateParams;
        var params = {};
        if (req.date) { params.date = req.date; }
        return invoice2Service.getCreditors(params);
      }]
    }
  });

  $stateProvider.state('root.invoice2.voucher', {
    abstract: true,
    url: '/vouchers',
    views: {
      'main@': {
        template: '<div ui-view></div>'
      }
    }
  });

  $stateProvider.state('root.invoice2.voucher.list', {
    url: '?minValue&maxValue',
    controller: 'VoucherListController',
    templateUrl: 'invoice2/voucher/list/voucherList.tpl.html',
    data: {pageTitle: 'Vouchers'},
    resolve: {
      vouchers: ['$stateParams', 'voucherService', function ($stateParams, voucherService) {
        var params = {};
        var minValue = parseFloat($stateParams.minValue);
        var maxValue = parseFloat($stateParams.maxValue);
        if (!isNaN(minValue)) { params.minValue = minValue; }
        if (!isNaN(maxValue)) { params.maxValue = maxValue; }
        return voucherService.search(params);
      }]
    }
  });

  $stateProvider.state('root.invoice2.account', {
    abstract: true,
    url: '/accounts',
    views: {
      'main@': {
        template: '<div ui-view></div>'
      }
    }
  });

  $stateProvider.state('root.invoice2.account.list', {
    url: '?unchecked',
    controller: 'v2_AccountListController',
    templateUrl: 'invoice2/account/list/v2_accountList.tpl.html',
    data: {pageTitle: 'Accounts'},
    resolve: {
      accounts: ['$stateParams', 'account2Service', function ($stateParams, account2Service) {
        var params = {
          // default to unchecked=true, unless explicitly set to false
          unchecked: $stateParams.unchecked !== 'false'
        };
        return account2Service.search(params);
      }]
    }
  });

  $stateProvider.state('root.invoice2.payment', {
    abstract: true,
    url: '/payments',
    views: {
      'main@': {
        template: '<div ui-view></div>'
      }
    }
  });

  $stateProvider.state('root.invoice2.payment.list', {
    url: '?gateway&minValue&maxValue&startDate&endDate',
    controller: 'PaymentListController',
    templateUrl: 'invoice2/payment/list/paymentList.tpl.html',
    data: {pageTitle: 'Payments'},
    resolve: {
      payments: ['$stateParams', 'paymentService', function ($stateParams, paymentService) {
        var params = {};
        if ($stateParams.gateway) { params.gateway = $stateParams.gateway; }
        var minValue = parseFloat($stateParams.minValue);
        var maxValue = parseFloat($stateParams.maxValue);
        if (!isNaN(minValue)) { params.minAmount = minValue; }
        if (!isNaN(maxValue)) { params.maxAmount = maxValue; }
        var startDate = $stateParams.startDate ? moment($stateParams.startDate) : moment().subtract(1, 'months');
        var endDate = $stateParams.endDate ? moment($stateParams.endDate) : moment().add(1, 'months');
        if (startDate || endDate) {
          params.timeFrame = {
            startDate: startDate.format('YYYY-MM-DD HH:mm'),
            endDate: endDate.format('YYYY-MM-DD HH:mm')
          };
        }
        return paymentService.getPayments(params);
      }]
    }
  });

  $stateProvider.state('root.invoice2.payout', {
    abstract: true,
    url: '/payouts',
    views: {
      'main@': {
        template: '<div ui-view></div>'
      }
    }
  });

  $stateProvider.state('root.invoice2.payout.list', {
    url: '?gateway&state&startDate&endDate',
    controller: 'PayoutListController',
    templateUrl: 'invoice2/payout/list/payoutList.tpl.html',
    data: {pageTitle: 'Payouts'},
    resolve: {
      payouts: ['$stateParams', 'paymentService', function ($stateParams, paymentService) {
        var params = {};
        if ($stateParams.gateway) { params.gateway = $stateParams.gateway; }
        if ($stateParams.state) { params.state = $stateParams.state; }
        var startDate = $stateParams.startDate ? moment($stateParams.startDate) : moment().subtract(1, 'months');
        var endDate = $stateParams.endDate ? moment($stateParams.endDate) : moment().add(1, 'months');
        if (startDate || endDate) {
          params.timeFrame = {
            startDate: startDate.format('YYYY-MM-DD HH:mm'),
            endDate: endDate.format('YYYY-MM-DD HH:mm')
          };
        }
        return paymentService.getPayouts(params);
      }]
    }
  });

})
;
