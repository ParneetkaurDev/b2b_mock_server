## PRD: Agricultural Equipment Hiring


<b>As a Buyer</b> of Equipment hiring services <b>I am</b> looking for various <b>equipments</b> available to hire in my vicinity <b>So that</b> I can fulfil my agricultural requirements <b>When</b> I require an Equipment in immediate or near future and for a specific time period <b>Why,</b> as this becomes a quick and easy mechanism for executing my requirement without bearing the cost of buying the Equipment.

<b>As a Seller</b> of a Equipment hiring services with type of equipments <b>I want to</b> list my equipments along with the detailed specifications and requirements for hiring equipments <b>So that</b> buyers across various locations can browse, book and avail equipments <b>When</b> the buyer requires based on the respective equipment availability <b>Why</b> as the network allows me access to varied set of buyers across buyer apps 


#### Buyer is looking to hire an equipment for a specific duration

- <b>Buyer</b> (looking to hire an Equipments)
- <b>Buyer app</b> (providing the interface for the buyer looking for hiring an equipment over the network)
- <b>Seller</b> (providing Equipments to hire)
- <b>Seller app</b> (providing the interface for the seller looking to get their Equipment hired over the network)

#### Initiate equipment hiring journey search

The search intent from the buyer focuses on specific agricultural equipment needs, such as irrigation equipment (defined by category codes like SRV17-1035) which corresponds to equipment like the Tractor.

#### Broadcast to sellers

The intent is broadcasted from the buyer app to all the relevant seller apps on the network through the gateway

#### Sellers response

- Based on the intent, the request is broadcasted to all the relevant sellers on the network through the gateway
- In response, the Seller has shared the catalog detailing all specifications and features of the equipment as per the search intent. Quantity is measured in hours and days, and one can find comprehensive information regarding serviceability and operational time within the catalog. 
Note:- serviceability and time can be reffered from <a href="https://docs.google.com/document/d/1f4QbVstY5m-L_-Jut5jvbeiaBKLR1ttJL_am6GG2Fko/edit">[this document]</a> and to generate/about the GeoJSON (if required) need to refer <a href="https://docs.google.com/document/d/1R4tw3L5jjjqxHxP21sLlSO2YQqpwn3ln0I5Eo7kintM/edit">[this document]</a>
- Seller apps with relevant offerings send their responses to the buyer app and the buyer app renders the offerings for the buyer to go through the provided details

#### Booking order placement

1. Buyer browses through the offerings and selects a particular Tractor/Equipment/equipment (of a particular provider) and examines the various details, prices, specifications, amenities and terms and conditions.

2. Buyer then proceeds with booking the Tractor/Equipment/equipment for the desired duration and the desired fulfilment option. 

3. The Price will include following details 	
    - Price Per Hour
    - Tax
    - Discount
    - Refundable Security
    - Delivery
    - Surcharges
        - Case 1: In case the buyer opts for self pickup (if provided by the seller), equipment location and pickup instructions are shared with the buyer
        - Case 2: In case the buyer opts for equipment delivery (if provided by the seller), fulfilment details are shared with the buyer as per the duration required 

            - With Driver
            - Without Driver

4. Seller responds to the initiation of the booking with confirmed pricing details and settlement details are exchanged depending
 on the application collecting the payment. If the buyer app is collecting payment from the buyer, the seller app shares their settlement details and vice versa

5. Payment is collected for order confirmation initiation
    - Hour Basis : The Buyer wants to be billed as per the hours it would take to use the equipment for the required tasks. 
      - Pre Fulfilment : The Buyer pays the rent upfront
      - On Fulfilment : The Buyer pays the advance amount to book and the rest after fulfilment
      - Post Fulfilment : The Buyer pays for the service after the fulfilment
    - Case 1: Buyer app collects payment and initiates the confirmation call
    - Case 2: Seller app collects payment, seller app provides its payment collection details and shares confirmation on the payment successful post confirmation initiation received form the buyer app.

6. Order confirmation request is then placed by the buyer and the seller confirms the order and provides the form for collecting requisite documents from the buyer.

7. Buyer fills the form provided

#### Journey initiation and fulfilment

1. Once the order is confirmed, the confirmed equipment details are shared by the seller along with pickup/ collection details of the equipment

2. At the time of initiation of the journey or delivery of the equipment to the buyer, the seller verifies requisite details of the buyer (checklist provided as part of the catalog details)

3. With successful verification, the equipment is handed over to the buyer

4. Buyer completes their journey following the guidelines provided for the hiring service

5. Buyer returns the equipment to the respective return location

6. Seller conducts an inspection to ensure no new damages occurred during the trip and completes the order with no change  required on the payment/ payment

#### Post fulfilment

1. Seller requests ratings and reviews on the services provided

2. Buyer leaves a detailed review on the buyer, sharing both positive and negative aspects. Buyer app shares the same with the seller app following the rating framework


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




