## PRD: Agriculture Bids And Auction

<b>As a Buyer</b> of an Agri commodity <b>I am</b> looking to participate in Auction of the required commodity <b>So that</b> I can Bid for the required Commodity as per my allocated Budget <b>When</b> I require them to use/resell

<b>As a Seller</b> of an Agri Commodity <b>I want to </b> list my Product in Market for Open/Close Bidding <b>So that</b> buyers can bid for it and I get the right price <b>When</b> I have ample Agri Produce

- <b>Buyer</b> (looking to bid for Products (Agri Produce) available in Auction)
- <b>Buyer app</b> (providing the interface for the buyer looking forAuctions available on the product)
- <b>Seller</b> (selling products in an Auction to the relevant and highest bidder)
- <b>Seller app</b> (providing the interface for the seller looking to sell their products via Auction on the network)

### Booking order placement
1. Buyer browses through the offerings and selects a particular Agri Produce and examines the various details, prices, specifications and terms and conditions while Buyer App shares the buyer ID for verification
2. Seller App verifies the Buyer ID, terminates the transaction if ineligible.
3. Buyer then proceeds with bidding for the crop keeping Floor Price and Bid Increment in mind
4. Seller responds to the initiation of the booking with confirmed pricing details and settlement details are exchanged depending on the application collecting the payment. If the buyer app is collecting payment from the buyer, the seller app shares their settlement details and vice versa
5. The participation fee or EMD (Earnest Money Deposit) is often used to check the seriousness of the Buyer
    - EMD Required
        - EMD shared as per the Seller’s T & C
        - Other Charges
    - No Participation Fee Required (Jump to Fulfilment)
6. Payment is collected for order confirmation initiation 
    - BAP Collecting
    - BPP Collecting
7. Order confirmation request is then placed by the buyer by confirming the Bid. All the bids defined by the Buyer will be accepted (even if its less than the current Highest price)
8. Once the order is confirmed, Order ID will be created and <b>Bid State</b> will be defined as <b>“Placed”</b>

### Post Order confirmation 
1. <b>Step 1 :</b> Buyer will requests the update on the Auction like <b>current Highest BidPost Order Placement/ Fulfilment</b>
2. Seller notifies the current Highest Bid and if the Buyer wants to update the Bid he can (before the End Date)
3. Buyer updates the Bid and the same is reflected at both ends. <b>Back to step 1</b> until the End date arrives.
4. Once the auction ends, Buyer requests for the final update
    - If Buyer wins, <b>Bid State</b> will be defined as <b>“Awarded”</b>
    - If Buyer loses, a Cancel call will be made. The buyer will be made aware of the winning Bid and <b>Bid State</b> will be <b>“Not Awarded”</b>
5. If Buyer is awarded the Bid, payment (Security Deposit) will be collected for order confirmation initiation
    - Case 1: Buyer app collects payment and initiates the confirmation call
    - Case 2: Seller app collects payment, seller app provides its payment collection details and shares confirmation on the payment successful post confirmation initiation received form the buyer app
6. If Buyer loses the Bid, the refund for EMD will be initiated.
7. Buyer leaves a detailed review on the buyer, sharing both positive and negative aspects. Buyer app shares the same with the seller app following the rating framework


### Offer Definition Template

| #  | Offer Type | Offer ID (Example) | Qualifier |                |                | Benefit   |          |           |            |         |            |
|----|------------|--------------------|-----------|----------------|----------------|-----------|----------|-----------|------------|---------|------------|
|    |            |                    | Min Value | Item Count     | Item ID        | Value     |Value Type| Value Cap | Item Count | Item ID | Item Value |
| 1  | discount   | DISCP60            | ₹159      |                |                | -60       | percent  | -₹120     |            |         |            |
| 2  | discount   | FLAT150            | ₹499      |                |                | -₹150     | amount   |           |            |         |            |
| 3  | buyXgetY   | BUY2GET3           |           | 2              |                |           |          |           | 3          | item id |            |
| 4  | freebie    | FREEBIE            | ₹598      |                |                |           |          |           | 1          | item id | ₹200       |


In the template above:

- Offer type - standard offer types:
    - discount - discount percent or amount applied to the cart value, with or without a cap, and may be based on minimum cart value;
    - buyXgetY - for every "X" item count in the cart, total of "Y" items will be offered (i.e. "Y" - "X" additional items), at 0 additional value;
    - freebie - for a minimum order value, 1 or more free item(s) will be offered at 0 value;
- Offer id - unique offer id from provider;
- Offer qualifiers:
    - Min value - min cart value for the offer to be applicable;
    - Item count - min count of items in the cart for the offer to be applicable;
    - Item id - Item id that qualifies for offer;
- Offer benefit:
    - Value - discount on the cart value (-ve) or value for extra items offered (0);
    - Value type - "percent", "amount";
    - Value cap - cap on the offer value;
    - Item count - total count of items offered;
    - Item id - additional item offered, should be part of the catalog;
    - Item value - actual value of item being offered;
    
Description of the above (example) offer ids:
- DISCP60 - 60% off up to ₹120, for order value above ₹159;
- DISCA150 - flat 150 off, for order value above ₹499;
- BUY2GET3 - buy 2 items, get additional item for free or for offered price;
- FREEBIE - free item (of value ₹200) for order value above ₹598;

