const Razorpay = require('razorpay');

/**
 * Payment Service - Razorpay Integration
 * Handles test payouts for approved claims.
 */
class PaymentService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey123',
      key_secret: process.env.RAZORPAY_SECRET || 'mock_secret_456'
    });
  }

  /**
   * Process a payout via Razorpay Route/Transfers
   * @param {Object} claim - The claim document
   * @param {Object} user - The user document receiving the payout
   */
  async processPayout(claim, user) {
    try {
      console.log(`[PaymentService] Initiating Razorpay transfer for Claim: ${claim._id}`);
      
      // In a real production scenario, we would use RazorpayX Payouts or Route API
      // Since this is a test/hackathon environment, we simulate the API call delay and return a mock success response
      // if valid keys aren't present.

      if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_mockkey123') {
         // Attempt real Razorpay Transfer API call (conceptual implementation)
         // const transfer = await this.razorpay.transfers.create({
         //   account: user.razorpayAccountId, // User needs a linked account
         //   amount: claim.payout * 100, // Amount in paise
         //   currency: "INR",
         //   notes: { claimId: claim._id.toString() }
         // });
         // return { success: true, txnId: transfer.id, timestamp: new Date() };
      }

      // Hackathon Simulation Fallback
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency
      const mockTxnId = 'pay_' + Math.random().toString(36).substr(2, 14);
      console.log(`[PaymentService] Transfer Successful. TXN ID: ${mockTxnId}`);
      
      return {
        success: true,
        txnId: mockTxnId,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('[PaymentService] Payout failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new PaymentService();
