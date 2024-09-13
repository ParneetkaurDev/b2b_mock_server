# PRD: Agriculture Services Cases

## In/Out of Scope (WIP)

<table>
<colgroup>
<col style="width: 9%" />
<col style="width: 77%" />
<col style="width: 13%" />
</colgroup>
<thead>
<tr class="header">
<th>Status</th>
<th>Requirement #</th>
<th>Priority</th>
</tr>
<tr class="odd">
<th>In</th>
<th>Buyers can discover soil testing and assaying service providers
within the network.</th>
<th>MVP</th>
</tr>
<tr class="header">
<th>In</th>
<th>Buyers can compare and select services from various sellers.</th>
<th>MVP</th>
</tr>
<tr class="odd">
<th>In</th>
<th>Buyers have the flexibility to choose service fulfilment options,
including sample pickup or delivery.</th>
<th>MVP</th>
</tr>
<tr class="header">
<th>In</th>
<th>Buyers can securely make payments and receive confirmation of their
orders.</th>
<th>MVP</th>
</tr>
<tr class="odd">
<th>In</th>
<th>Buyers can conveniently track the status of their orders.</th>
<th>MVP</th>
</tr>
<tr class="header">
<th>In</th>
<th>Buyers have the ability to raise and resolve any issues with
sellers.</th>
<th>MVP</th>
</tr>
<tr class="odd">
<th>Out</th>
<th>Both buyers and sellers can negotiate pricing for the provided
services.</th>
<th>Future</th>
</tr>
<tr class="header">
<th>Out</th>
<th>Sellers can offer "Quality Assurance as a Service" to enhance
customer satisfaction.</th>
<th>Future</th>
</tr>
<tr class="odd">
<th>Out</th>
<th>Buyers have the option to utilise logistics services for sample
transportation.</th>
<th>Future</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

##

## List of Use Cases

<table>
<colgroup>
<col style="width: 15%" />
<col style="width: 70%" />
<col style="width: 14%" />
</colgroup>
<thead>
<tr class="header">
<th>S.No.</th>
<th>Description</th>
<th>Priority</th>
</tr>
<tr class="odd">
<th>1</th>
<th><strong>As a buyer</strong>, whether a farmer, a Farmer Producer
Organization (FPO), or a trader,<br />
<strong>I want to be able to,</strong> initiate a service request
effortlessly. This request should prompt service professionals to
provide relevant quotations.<br />
<strong>So that</strong>, I aim to select and avail services seamlessly
from a single interface.</th>
<th><blockquote>
<p><strong>MVP</strong></p>
</blockquote></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Detailed Use Cases

<table>
<colgroup>
<col style="width: 18%" />
<col style="width: 81%" />
</colgroup>
<thead>
<tr class="header">
<th><h3 id="use-case-1" class="unnumbered">Use Case 1</h3></th>
<th>Buyer raises a request for soil testing service on a buyer app →
Seller Responds back with a catalogue → Buyer compares and selects a
provider → Sellers responds back with final quotation → Buyer makes the
payment → Order is confirmed by the seller → Service is delivered by the
seller to the buyer</th>
</tr>
<tr class="odd">
<th>Actor</th>
<th><blockquote>
<p><strong>Buyer (one with the need) || Seller (one with the inventory)
|| Buyer app || Seller app</strong></p>
</blockquote></th>
</tr>
<tr class="header">
<th>Main Path</th>
<th><p><strong>Initiate Buyer’s Request</strong></p>
<ol type="1">
<li><p>Buyer raises an interest for buying a particular agri service,
example, Soil testing, water testing, chemical testing etc. with all the
specific details, namely:</p>
<ol type="a">
<li><p>Schedule for when the test is required (optional)</p>
<ol type="i">
<li><p>Date and Time</p></li>
<li><p>Although, date &amp; time is optional for the buyer to share in
the initial intent, for the final order schedule becomes necessary in
some cases. Therefore, in case where the buyer is not sharing the
schedule, seller will share the available slots for the buyer to
select</p></li>
</ol></li>
<li><p>Location of the farm/buyer collection point (optional)</p>
<ol type="i">
<li><p>This is only required when the buyer wants the seller to collect
the sample</p></li>
</ol></li>
<li><p>Mobile number of the buyer (optional)</p>
<ol type="i">
<li><p>Need this to send reports link</p></li>
</ol></li>
<li><p>Required tests (mandatory)</p>
<ol type="i">
<li><p>Soil Test</p>
<ul>
<li><p>Soil PH test</p></li>
<li><p>N,P,K,S test</p></li>
<li><p><a
href="https://docs.google.com/spreadsheets/d/1xRXkUZSduhKfjgFtOEooIN_jkPWMukdM/edit#gid=1823188204"><u>Soil
Testing types.xlsx</u></a> - this has the list of tests that are
available for the buyer to select for soil testing</p></li>
</ul></li>
<li><p>Water Test</p></li>
<li><p>Chemical Test</p></li>
<li><p>Assaying Services (this is detailed out separately <a
href="#use-case-2"><u>HERE</u></a>)</p>
<ul>
<li><p><a
href="https://docs.google.com/spreadsheets/d/1iwW-wn-ZE1uqhg8wTNeqXWqYysP6tA60/edit#gid=496642592"><u>Agri-Input
and Output Final_31082023 (1) (1).xlsx</u></a> - this has the list of
tests that are available for the buyer to select for availing the
assaying services</p></li>
</ul></li>
</ol></li>
<li><p>The buyer will also specify when is the report required by the
buyer</p>
<ol type="i">
<li><p>This is an input from the buyer which is required sometime since
the buyer is running on deadlines</p>
<ul>
<li><p>Ex. : As a farmer I need the assaying report by the 10th of the
month since I have to sell my produce in the mandi on the 11th.</p></li>
</ul></li>
<li><p>We will allow the seller to share with the catalogue along with
the TTL required to perform the entire set of functions required for a
particular service. This will include</p>
<ul>
<li><p>Time to collect the sample, where the seller is collecting from
the buyer locations</p></li>
<li><p>Time to test and share the report</p></li>
<li><p>Total time by which the report will be available</p></li>
</ul></li>
</ol></li>
</ol></li>
</ol>
<p><strong>Broadcast to Sellers</strong></p>
<ol start="2" type="1">
<li><p>The interest is broadcasted to all the available sellers on the
ONDC network via the gateway</p></li>
</ol>
<p><strong>Sellers Respond</strong></p>
<ol start="3" type="1">
<li><p>Sellers will respond with their catalogues against the request
made by the buyers</p></li>
<li><p>Catalogue will be curated as per the taxonomy shared here<a
href="https://docs.google.com/spreadsheets/d/1k63dFpX4MimR36I9BW94KiprMDDYy33x/edit#gid=1861881420"><u>Agri
services prerequisite .xlsx</u></a></p></li>
<li><p>Seller will share the following along with the catalogue</p>
<ol type="a">
<li><p>Collection/fulfilment options available</p>
<ol type="i">
<li><p>Collection by the seller</p>
<ul>
<li><p>If the buyer wants the seller to collect the sample the time slot
selection becomes mandatory</p></li>
<li><p>Available time slot will be shared by the seller for the location
of the buyer</p></li>
<li><p>Required preparation by the buyer (if any) - PDF + Video</p></li>
<li><p>Post the order is confirmed share the following details with the
buyer</p>
<ol type="a">
<li><p>Who will be visiting to collect the sample</p>
<ol type="i">
<li><p>Status of professional coming to pick up the sample - in transit,
to be started, reached.</p></li>
<li><p>Name, number, of the professional visiting</p></li>
</ol></li>
</ol></li>
<li><p>TTL for the entire process will also be shared by the seller for
the buyer to take an informed decision</p>
<ol type="a">
<li><p>TTL for collection of the sample</p>
<ol type="i">
<li><p>Status of the sample collection &amp; test being
conducted</p></li>
</ol></li>
<li><p>TTL for test result generation after sample collection</p></li>
</ol></li>
</ul></li>
<li><p>Sent by the buyer to the seller location</p>
<ul>
<li><p>In this case the location of the buyer becomes optional, however
the seller’s location where the buyer needs to send the sample to
becomes important and mandatory</p></li>
<li><p>The expected catalogue will have</p>
<ol type="a">
<li><p>Seller location with complete address</p>
<ol type="i">
<li><p>Share the format which the BAP can take a print of - Packing
Slip</p></li>
</ol></li>
<li><p>How to collect the sample and send description doc - PDF,
Video</p></li>
<li><p>TTL to complete the test once the sample is received</p></li>
</ol></li>
<li><p>In this case, seller will expect the update of the sample sent by
the buyer with the following details</p>
<ol type="a">
<li><p>Docket number/AWB number for the tracking of the
shipment</p></li>
<li><p>Date</p></li>
<li><p>and provider of shipment, example, DTDC, FedEX etc.</p></li>
</ol></li>
</ul></li>
</ol></li>
</ol></li>
<li><p>Quotation will be provided basis the service type and collection
type selected by the buyer</p></li>
<li><p>Within the quotation the seller can give discounts applicable for
the specific order.</p></li>
<li><p>However, if they have generic offers those can be shared as part
of the overall catalogue.</p></li>
<li><p>Cancellation terms are shared</p>
<ol type="a">
<li><p>Cancellable or not</p></li>
<li><p>Can be cancelled before X hours from the actual delivery of
services</p></li>
<li><p>Charges applicable for cancellation</p></li>
</ol></li>
<li><p>Rescheduling of the service</p>
<ol type="a">
<li><p>Allowed or not allowed</p></li>
<li><p>Can be rescheduled before X hours from the actual delivery of the
service booked</p></li>
<li><p>Charges applicable for rescheduling</p></li>
</ol></li>
<li><p>Refund terms are shared</p></li>
<li><p>Sellers will share the terms and conditions in a URL for the
buyer to go through - these are generic terms outside of the above
mentioned terms.</p></li>
</ol>
<p><strong>Offer Management &amp; Selection</strong></p>
<ol start="13" type="1">
<li><p>Buyer will select the most suitable provider/seller along with
the suitable fulfilment type and the time slot from the available
schedule</p>
<ol type="a">
<li><p>Case 1 : Buyer selects the schedule from the available
schedule</p>
<ol type="i">
<li><p>The selected time slot was available</p>
<ul>
<li><p>Quotation will be shared by the seller</p></li>
</ul></li>
<li><p>The selected time slot was not available since the slot can be
cached by the buyer app</p>
<ul>
<li><p>The seller will share the available time slot at the
time.</p></li>
<li><p>The buyer app will display the new time schedules shared</p></li>
</ul></li>
</ol></li>
<li><p>Case 2 : Buyer does not select from the available schedule</p>
<ol type="i">
<li><p>The seller will share the available time slot at the
time</p></li>
<li><p>The buyer will select from the available slots displayed</p></li>
</ol></li>
</ol></li>
<li><p>Quotation will be shared by the seller once all the variables are
finalised by the buyer</p>
<ol type="a">
<li><p>The quotation will breakup the entire quote into the following
by-parts</p>
<ol type="i">
<li><p>Price of the item selected</p></li>
<li><p>Convenience fee</p></li>
<li><p>Tax</p></li>
<li><p>Discounts provided</p></li>
<li><p>Other charges as misc.</p></li>
</ol></li>
<li><p>Every quotation will have an associated TTL with it</p></li>
<li><p>One thing to note here is that tax is not collected for any
service provided to a farmer therefore the seller will ensure the
quotation is prepared accordingly basis the profile of the buyer</p>
<ol type="i">
<li><p>Buyer app will share a flag for every search request with the
profile of the buyer - Farmer, Enterprise, Individual buyer.</p></li>
</ol></li>
</ol></li>
</ol>
<p><strong>Payment and Confirmation of Order</strong></p>
<ol start="15" type="1">
<li><p>The buyer will make the payment to confirm the order</p>
<ol type="a">
<li><p>Payment can have multiple scenarios, like</p>
<ol type="i">
<li><p>Entire payment to be made on-fulfilment.</p>
<ul>
<li><p>In this case the payment needs to be made before the report is
shared with the buyer</p></li>
</ul></li>
<li><p>Entire payment to be made pre-fulfilment.</p>
<ul>
<li><p>In this case the payment needs to be made before the order is
placed</p></li>
</ul></li>
<li><p>Some part of the payment is pre-fulfillment and some
on-fulfilment.</p>
<ul>
<li><p>In this case payment will be collected twice in the journey,
i.e., one for placing the order and the other before the report can be
shared</p></li>
</ul></li>
</ol></li>
</ol></li>
<li><p>We do not envisage a use case where the entire payment is
post-fulfilment. Therefore the same is not included as part of this
implementation.</p></li>
<li><p>Invoicing</p>
<ol type="a">
<li><p>No GST for Kisaan</p></li>
<li><p>GST will be applicable at 18% for the entity and
individual</p></li>
<li><p>So we need to capture on the profile of the buyer on the buyer
app - Kisaan/Enterprise/Individual</p></li>
</ol></li>
</ol>
<p><strong>Post Order activities</strong></p>
<ol start="18" type="1">
<li><p>Once the order is confirmed, the buyer and seller will take
relevant actions as per the terms of the order</p>
<ol type="a">
<li><p>Sample to be collected from the location of the buyer</p>
<ol type="i">
<li><p>Seller initiates a pick up and updates the buyer app via the
seller app of the details,</p>
<ul>
<li><p>Name of the sample pick up service professional</p></li>
<li><p>Photo</p></li>
<li><p>Contact details</p></li>
</ul></li>
<li><p>Once the sample is collected update the status on the Buyer app
for the buyer to consume</p></li>
</ol></li>
<li><p>Sample to be sent by the buyer at the location of the seller</p>
<ol type="i">
<li><p>Buyer gets the delivery shipment slip from the order details
shared by the seller app.</p></li>
<li><p>Buyer packs the sample as defined by the seller. Details received
with the order</p></li>
<li><p>Once the sample is dispatched, update the details - Courier
details - tracking ID, courier company</p></li>
<li><p>Details of the receipt of the sample is updated by the seller on
the buyer app.</p></li>
</ol></li>
<li><p>Once the sample is processed for the required tests to be
performed, the seller will update the buyer about the completion and
also share the report of the same.</p>
<ol type="i">
<li><p>Payment link will be shared here in case the payment terms were
on-fulfilment</p></li>
</ol></li>
</ol></li>
</ol></th>
</tr>
<tr class="odd">
<th>Alternate Path 1</th>
<th>Sample sent by the buyer or collected by the seller needs to be
retaken due to any reason</th>
</tr>
<tr class="header">
<th>Alternate Path 2</th>
<th>Buyer does not agree with the report shared by the seller and wants
a re-test done</th>
</tr>
<tr class="odd">
<th>Alternate Path 3</th>
<th>Buyer does not agree with the report shared by the seller and wants
a refund</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

##

<table>
<colgroup>
<col style="width: 18%" />
<col style="width: 81%" />
</colgroup>
<thead>
<tr class="header">
<th><h3 id="use-case-2" class="unnumbered">Use Case 2</h3></th>
<th>Buyer raises a request for assaying service on a buyer app → Seller
Responds back with a catalogue → Buyer compares and selects a provider →
Sellers responds back with final quotation → Buyer makes the payment →
Order is confirmed by the seller → Service is delivered by the seller to
the buyer</th>
</tr>
<tr class="odd">
<th>Actor</th>
<th><blockquote>
<p><strong>Buyer (one with the need) || Seller (one with the inventory)
|| Buyer app || Seller app</strong></p>
</blockquote></th>
</tr>
<tr class="header">
<th>Main Path</th>
<th><p><strong>Initiate Buyer’s Request</strong></p>
<ol type="1">
<li><p>Buyer (Farmer/Trader/FPO) raises an intent to get the assaying
services for their output crop</p></li>
<li><p>While raising the intent following is shared</p>
<ol type="a">
<li><p>Crop and its variety - refer to <a
href="https://drive.google.com/file/d/1TumyJR36nVSc409VEeywZ4gCt7r0xCUT/view?usp=drive_link"><u>THIS</u></a>
sheet for all the agricultural commodities</p></li>
<li><p>Quantity (optional)</p></li>
</ol></li>
<li><p>The buyer will also choose the test that they intend to be
done</p>
<ol type="a">
<li><p>Every commodity has a list of available tests from which the
buyer will choose from.</p></li>
<li><p>The list of available tests for the notified commodity is
available <a
href="https://drive.google.com/file/d/1TumyJR36nVSc409VEeywZ4gCt7r0xCUT/view?usp=drive_link"><u>HERE</u></a>.</p></li>
<li><p>Agnxt, one of our seller NP, only does the <a
href="https://drive.google.com/file/d/1HRIdFfuMyJOq1Ne1rVp4yPwFKUHchA63/view?usp=sharing"><u>FOLLOWING</u></a>
assaying services</p></li>
</ol></li>
<li><p>The location of the buyer will also be shared in cases where the
buyer wants the service provider to pick up the sample.</p>
<ol type="a">
<li><p>Location is shared with GPS coordinates and complete
address</p></li>
</ol></li>
</ol>
<p><strong>Broadcast to Sellers</strong></p>
<ol start="5" type="1">
<li><p>This request is then broadcasted to all the available sellers
providing assaying services on the network.</p></li>
</ol>
<p><strong>Sellers Respond</strong></p>
<ol start="6" type="1">
<li><p>Sellers will reply back with their catalogue which will have the
following</p>
<ol type="a">
<li><p>Methods available for the required test, for example,</p>
<ol type="i">
<li><p>Oil testing can be done through chemical test</p></li>
<li><p>The same can be done through visual methods</p></li>
</ol></li>
<li><p>Different methods will have different associated costs and the
time to completion</p></li>
<li><p>Sellers will also send along with the methods some information
(PDF) about how the test is done and what are the accuracies of each
method</p></li>
</ol></li>
<li><p>While sharing the catalogue the sellers will also provide various
fulfilment methods that are available:</p>
<ol type="a">
<li><p>Collection by the seller</p>
<ol type="i">
<li><p>Who will be visiting to collect the sample</p>
<ol type="1">
<li><p>Status of professional coming to pick up the sample - in transit,
to be started, reached.</p></li>
<li><p>Name, number, photo of the professional visiting</p></li>
</ol></li>
<li><p>Required preparation by the buyer (if any)</p></li>
<li><p>TTL for the entire process</p>
<ol type="1">
<li><p>Collection of the sample</p></li>
<li><p>Test result generation after sample collection</p></li>
</ol></li>
<li><p>Status of the sample collection &amp; test being
conducted</p></li>
</ol></li>
<li><p>Sent by the buyer to the seller location</p>
<ol type="i">
<li><p>Seller location with complete address</p>
<ol type="1">
<li><p>Share the format which the BAP can take a print of - Packing
Slip</p></li>
</ol></li>
<li><p>How to collect and send the sample</p>
<ol type="1">
<li><p>PDF + video</p></li>
</ol></li>
<li><p>TTL to complete the test once the sample is received</p></li>
<li><p>Status of the sample collection &amp; test being
conducted</p></li>
</ol></li>
</ol></li>
<li><p>In case the buyer selects sample collection by the seller then
the seller will share available schedules for the buyer to
select.</p></li>
<li><p>Quotation will be provided basis the tests methodology selected
and collection type selected by the buyer</p>
<ol type="a">
<li><p>Every quotation will have a TTL</p></li>
</ol></li>
<li><p>Cancellation terms are shared</p>
<ol type="a">
<li><p>Cancellable or not</p></li>
<li><p>Can be cancelled before X hours from the actual delivery of
services</p></li>
<li><p>Charges applicable for cancellation</p></li>
</ol></li>
</ol>
<p><strong>Offer Management &amp; Selection</strong></p>
<ol start="19" type="1">
<li><p>Buyer will select the most suitable provider/seller along with
the suitable fulfilment type</p></li>
</ol>
<p><strong>Payment and Confirmation of Order</strong></p>
<ol start="20" type="1">
<li><p>The buyer will make the payment to confirm the order</p>
<ol type="a">
<li><p>Payment can have multiple scenarios, like</p>
<ol type="i">
<li><p>Entire payment to be made on-fulfilment.</p>
<ul>
<li><p>In this case the payment needs to be made before the report is
shared with the buyer</p></li>
</ul></li>
<li><p>Entire payment to be made pre-fulfilment.</p>
<ul>
<li><p>In this case the payment needs to be made before the order is
placed</p></li>
</ul></li>
<li><p>Some part of the payment is pre-fulfillment and some
on-fulfilment.</p>
<ul>
<li><p>In this case payment will be collected twice in the journey,
i.e., one for placing the order and the other before the report can be
shared</p></li>
</ul></li>
</ol></li>
</ol></li>
<li><p>We do not envisage a use case where the entire payment is
post-fulfilment. Therefore the same is not included as part of this
implementation.</p></li>
<li><p>Invoicing</p>
<ol type="a">
<li><p>No GST is applicable for Kisaan/farmer</p></li>
<li><p>GST will be applicable at 18% for the entity/individual</p></li>
<li><p>So we need to capture on the profile of the buyer on the buyer
app - Kisaan/Enterprise/Individual</p></li>
</ol></li>
</ol>
<p><strong>Post Order activities</strong></p>
<ol start="23" type="1">
<li><p>Once the order is confirmed, the buyer and seller will take
relevant actions as per the terms of the order</p>
<ol type="a">
<li><p>Sample to be collected from the location of the buyer</p>
<ol type="i">
<li><p>Seller initiates a pick up and updates the buyer app via the
seller app of the details,</p>
<ul>
<li><p>Name of the sample pick up service professional</p></li>
<li><p>Photo</p></li>
<li><p>Contact details</p></li>
</ul></li>
<li><p>Once the sample is collected update the status on the Buyer app
for the buyer to consume</p></li>
</ol></li>
<li><p>Sample to be sent by the buyer at the location of the seller</p>
<ol type="i">
<li><p>Buyer gets the delivery shipment slip from the order details
shared by the seller app.</p></li>
<li><p>Buyer packs the sample as defined by the seller. Details received
with the order</p></li>
<li><p>Once the sample is dispatched, update the details - Courier
details - tracking ID, courier company</p></li>
<li><p>Details of the receipt of the sample is updated by the seller on
the buyer app.</p></li>
</ol></li>
<li><p>Once the sample is processed for the required tests to be
performed, the seller will update the buyer about the completion and
also share the report of the same.</p>
<ol type="i">
<li><p>Payment link will be shared here in case the payment terms were
on-fulfilment</p></li>
</ol></li>
</ol></li>
<li><p>Report is shared with the buyer. <a
href="https://drive.google.com/file/d/13ncsHREYzRWuLtyPxW5Nmi_QemyzKXy1/view?usp=sharing"><u>HERE</u></a>
is a sample of the report.</p></li>
</ol></th>
</tr>
</thead>
<tbody>
</tbody>
</table>
