# Business Requirement Document for Skilled and Semi-skilled Services (Individual and Team)

# I. Overview
ONDC aims to expand the networks’ offerings to include skilled and semi-skilled services that can be provided by an individual or a team of individuals. ONDC aims to bring together a diverse group of aggregators/service professionals operating in different geographies with unique service offerings to build a nationwide network of easy-to-access skilled and semi-skilled services. Some of these services are:
1. Appliance repair 
2. Home Maintenance - Cleaning, Pest control etc.
3. Home Repair - Plumbing, Electrician, Carpentry
4. Assembly and Installation
5. Spa and Salon services for men and women
6. Maid, Gardner Services
7. Coaching Services
8. Painting
9. Packers and Movers
10. Mason Services (Tiles, Paint, POP)
11. Healthcare services 

The purpose of this document is to detail an MVP for services on ONDC, which will enable purchase of said services on the Open Network. The open network shall allow interoperability between multiple services marketplaces/platforms and is destined to expand  further in terms of participants, increasing the category of services, and adding diverse use cases in the future. 

This document is intended to be the requirements specification for any interested party to join the ONDC network as a participant under their chosen role(s). 

Mode of Service delivery:
There are two primary modes to avail the service:
1. At a location chosen by the buyer
2. At the service provider’s location

Both these flows are covered as part of the MVP.

Type of Sellers

At time of search, the buyer can be exposed to two types of sellers on the network:
1. Type A: Service Providers/Aggregators that will take an order and allocate the same to service professionals of their choosing for execution of the order
2. Type B : Service Professionals (individuals) who will directly take an order and execute it 

This is not to be confused with MSN/ISN as service providers/aggregators can be both types depending on the method by which they bill the buyer. 

## II. Participants - needs & role in the network
| Participant | Role | Network Context|
| -- | -- | -- |
| Buyer (consumber) | Consumer of the service. For example, the homeowner who wants to have their microwave repaired. | Consumer |
| Buyer App | A buyer uses the buyer app to book services | Network Node for the Consumer |
| Seller App | A seller uses the seller app to indicate quotes and availability for various services | Network Node for the service provider |
| Seller | Sellers will be enlisted on the network through the seller app. Sellers will be of two types: **a)** Service Providers/Aggregators that will take an order and allocate the same to service professionals of their choosing for execution of the order. **b)** Service Professionals (individuals) who will directly take an order and execute it | Provider |
| Services Professional | The professional (carpenter, electrician, AC mechanic, etc.) who will be performing the service | Service Professional|
| | |

## III MVP User Journey

The user flow for a buyer booking a home service using a seller aggregator is envisaged as given:

### Stage 1: Discovery
1. The buyer begins their journey by accessing a buyer app. 

2. The buyer app requests the buyer for the following information: 
    1. location
    2. service type (Optional)
    3. start date (optional)
    4. start time (optional)
3. This information is sent to the seller app. The service catalogue available with the seller app, based on the attributes of the ONDC service taxonomy( link to taxonomy) along with quotes corresponding to the services, are shared with the buyer app.

> **Notes on catalogue:**
>
>    1. The catalogue can include packages of different services or hourly rates for engagement of service professionals. 
>    2. Each service in the catalogue will have information regarding if the service can be availed at the buyer’s location, seller’s location, or both. 
>    3. For services that require site visits (such as wall painting, moving and packing, etc.) before quotes can be generated a site visit cost will be displayed, if any.
>    4. The catalogue will also allow sellers to display credentials including certifications/ accreditations/ memberships e.g. Example: In the case of pathology labs, their registration certificate with relevant medical authorities may be provided.


4. The seller apps will share detailed catalogue (along with quotes) of sellers based on provider location serviceability and time slot availability (if provided by the buyer in Step 2). 

5. The buyer app displays available sellers (based on the user journey that the buyer app decides). Buyer will need to select a service and service provider to proceed. 

### Stage 2: Order Placement
6. The buyer adds the selected service and seller to their shopping cart.

7. The seller app confirms the availability of service, seller and time slot selected by buyer (if provided as part of step 2). Confirmation is required as there may be a lag between when service, seller and time slot is selected and when the combination of these three is added to cart.

8. If the buyer had not selected a timeslot in step (2), then the seller app sends a list of available timeslots to the buyer app. This list is displayed to the buyer and they select a time slot. The seller app confirms the availability of service, seller and time slot selected by the buyer.

9. The final quote, seller, and time slot are displayed to the buyer. The seller app re-confirms availability of the same. The buyer then places the order. 

10. The buyer is taken to the payment gateway page. The buyer or seller app’s payment gateway will be used to collect payment.

11. Upon successful payment, the order is confirmed.

12. Depending upon the service selected by the buyer, the seller app, as an optional step, may send a checklist of tools/equipment that the service professional may require at the buyers’ residence to complete that service. For example, a service professional visiting the buyer for split AC repair may require a ladder. 

13. The checklist is displayed to the buyer and they select the tools/equipment available with them. This list is communicated to the seller app. Even if the buyer does not have any of the equipment asked for by the seller, the order remains confirmed. This is because buyers are currently able to avail services without providing any information regarding the tools/equipment available with them. Hence, the information regarding what is available with the buyer is additional information for the service professionals’ benefit, but should not be grounds for cancellation by them. 

14. In case the selected seller is a service provider/aggregator, then they will need to provide information of the service professional (name, picture, phone number to contract service professional which can be masked) who will be visiting the buyer to perform the service requested. 

15. Seller defines if the service is cancellable, hours prior to service commencement that a cancellation request can be raised and payment terms for the same. E.g. If the cancellation is made within the time-period set by the seller, then the pre-prescribed amount paid by the buyer for the service will be refunded to them. On the other hand, if the cancellation is made outside the time-period, then only part refund is made to the buyer, depending upon the service providers’ policies.

16. Sellers defines if the service is re-schedulable, hours prior to service commencement that a re-scheduling request can be raised and payment terms for the same. E.g. Buyer should have an option to reschedule service within a predefined time-period by the seller. In case rescheduling is allowed as per the service provider, then step (7: time slot selection) and step (11: tools checklist) need to be refollowed. 

### Stage 3: Order Fulfillment

17. The following statuses will be visible to the buyer for the order placed:

| Status Update | Information Provider |
| -- | -- |
| Order Placed | Buyer App + Seller App |
| Order Confirmed | Seller App |
| Service Professional Assigned | Seller App |
| Service Professional Enroute | Seller App |
Service Started | OTP verified between buyer and seller |
| Service Ended | OTP verified between buyer and seller app (may be optional for some services e.g. spa and salon services) |
| | |

> **Please Note:** Step 18-21 are only applicable for services which are availed at the buyers locations

18. The status of the order is indicated as “Service Professional Enroute” by the seller app and tracking details of the service professional are provided by the seller app to the buyer app.

19. To indicate the order status ‘Service Started’, the Buyer App will need to generate an OTP and display it to the buyer on the buyer app. This will be physically supplied to the service professional by the buyer. The service professional will need to transfer the OTP through the seller app and subsequently communicate to the buyer app to confirm the status of order as ‘Service Started.’

20. If the service requires additional work/change of service type/ spare components etc. and there is a need to revise the quotation for the service, then the new quote is communicated by the seller app to the buyer app along with details of the additional services/ components. The buyer may choose to accept it or reject it. If they choose to accept the new quote, they are redirected to a payment page, for additional payment if any. After the payment is made, the seller app is notified, and the service professional completes the job. In case the buyer rejects the revised quote, the seller professional may continue with the service or provide a revised quotation.

21. Step 20 may be repeated multiple times prior to end of service.

22. The service professional delivers the service.

23. Job status is indicated as Service completed by the service professional/seller app. In case cases, the OTP process as described in step 19 may need to be followed to ensure that both buyer and seller are indicating the service as completed. (Optional for services such as spa, grooming etc.). 

24. Tax Invoice is shared by seller app to buyer app at end of service.

25. For services requiring a home/site visit

    1. The site visit is conducted using Step 19-22.
    2. Step 20 will be used to provide quotations for the additional work post site visit

26. As part of step 20, multiple quotes (including price breakup, start date, end date, payment terms etc.) can be generated for the service by the service professional depending upon the scope of service and the negotiations that occur between the service professional and the buyer. All these quotes are entered by the service professional into the seller app and communicated and displayed on the buyer app. The buyer may then select one of the quotes and proceed with the service.

27. Certain high-value services may need partial payment to be made during the service delivery. For these services, the seller app will trigger the buyer app for payment collection along with the amount to be collected. The buyer app can collect payment either directly or by rendering the payment gateway of the seller app. Every time receipt of payment takes place, a part-invoice should be shared for the services to the buyer app. At the end of the service a final invoice should also be shared with the buyer app.

### Stage 4: Post-fulfillment
28. Complaints will follow the standard ONDC [IGM](https://resources.ondc.org/igm) mechanism.

29. Payment and Settlement will follow the standard ONDC [RSP](https://docs.google.com/document/d/1ubUPAWpbbUJ4vG2h5TQ74srZBjYjrO0P/edit) mechanism. Payment settlement can be milestone based and will be predefined in the transaction contract.  

30. Review and Rating mechanism will follow the standard ONDC Rating and Scoring Mechanism. As part of the current MVP the rateable object will be the seller - which can be a service provider or service professional.

## IV. Exclusions
The following flows have been excluded from the MVP at this stage:

1. Post fulfilment flow of being able to call the same service professional again (in case of service aggregator). 
2. Change of location by buyer post confirmation of order
