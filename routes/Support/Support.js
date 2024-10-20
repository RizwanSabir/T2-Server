const { Issue } = require("../../models/Support/Issues");

const router = require("express").Router();


router.get("/", (req, res) => {
    res.status(200).send({ message: "ok everything is working " });
})

const overViewData = {
    totalQueries: "30",
    totalQueriesPercentage: "1.5",
    pendingQueries: "678",
    pendingPercentage: "1.5",
    resolvedQueries: "24,000",
    resolvedPercentage: "90.0",
};

const Issuestatistics = {
    Contract: "30",
    Payment: "15",
    Account: "5,678",
    Others: "1.5",
    Pending: "2",
    Resolved: "2",
    Progress: "43"
};

// Add the time also
const issues = [
    { "customerServiceID": "CS001", "userid": "12", "issue":"Contract","description": "Issue with product delivery", "status": "Pending", "attachment": "delivery_issue.pdf", "contractLink": null },
    { "customerServiceID": "CS002", "userid": "13", "issue":"Contract","description": "Unable to login to account", "status": "Resolved", "attachment": null, "contractLink": null },
    { "customerServiceID": "CS003", "userid": "14", "issue":"Account","description": "Billing issue for last month", "status": "Pending", "attachment": "billing_issue.pdf", "contractLink": "contracts/billing_contract.pdf" },
    { "customerServiceID": "CS004", "userid": "15", "issue":"Contract","description": "Broken product received", "status": "In Review", "attachment": "broken_product.jpg", "contractLink": null },
    { "customerServiceID": "CS005", "userid": "16", "issue":"Contract","description": "Delayed shipment for contract order", "status": "Pending", "attachment": "shipment_delay.pdf", "contractLink": "contracts/shipment_contract.pdf" },
    { "customerServiceID": "CS006", "userid": "17", "issue":"Contract","description": "Account suspended without notice", "status": "Resolved", "attachment": null, "contractLink": null },
    { "customerServiceID": "CS007", "userid": "18", "issue":"Contract","description": "Contract cancellation request", "status": "In Review", "attachment": "cancellation_request.pdf", "contractLink": "contracts/cancellation_contract.pdf" },
    { "customerServiceID": "CS008", "userid": "19", "issue":"Contract","description": "Refund not processed", "status": "Pending", "attachment": "refund_receipt.pdf", "contractLink": null },
    { "customerServiceID": "CS009", "userid": "20", "issue":"Contract","description": "Technical issue with the app", "status": " In Review", "attachment": "screenshot_tech_issue.jpg", "contractLink": null },
    { "customerServiceID": "CS010", "userid": "21", "issue":"Contract","description": "Incorrect billing information", "status": "Resolved", "attachment": "incorrect_billing.pdf", "contractLink": "contracts/billing_contract.pdf" },
    { "customerServiceID": "CS011", "userid": "22", "issue":"Contract","description": "Duplicate order received", "status": "Pending", "attachment": "duplicate_order.pdf", "contractLink": null },
    { "customerServiceID": "CS012", "userid": "23", "issue":"Contract","description": "Contract details clarification", "status": "In Review", "attachment": "contract_details.pdf", "contractLink": "contracts/service_contract.pdf" },
    { "customerServiceID": "CS013", "userid": "24", "issue":"Contract","description": "Product not as described", "status": "In Review", "attachment": "product_complaint.pdf", "contractLink": null },
    { "customerServiceID": "CS014", "userid": "25", "issue":"Contract","description": "Unable to update profile details", "status": "Pending", "attachment": null, "contractLink": null },
    { "customerServiceID": "CS015", "userid": "26", "issue":"Contract","description": "Late payment fee dispute", "status": "Resolved", "attachment": "payment_dispute.pdf", "contractLink": "contracts/payment_contract.pdf" },
    { "customerServiceID": "CS016", "userid": "27", "issue":"Contract","description": "Order not processed", "status": "Pending", "attachment": "order_issue.pdf", "contractLink": null },
    { "customerServiceID": "CS017", "userid": "28", "issue":"Contract","description": "Contract renewal request", "status": "In Review", "attachment": "renewal_request.pdf", "contractLink": "contracts/renewal_contract.pdf" },
    { "customerServiceID": "CS018", "userid": "29", "issue":"Contract","description": "Product refund not received", "status": "Pending", "attachment": "refund_issue.pdf", "contractLink": null },
    { "customerServiceID": "CS019", "userid": "30", "issue":"Contract","description": "Account locked after update", "status": "Resolved", "attachment": null, "contractLink": null },
    { "customerServiceID": "CS020", "userid": "31", "issue":"Contract","description": "Missing contract terms", "status": "Pending", "attachment": "missing_terms.pdf", "contractLink": "contracts/terms_contract.pdf" }
];

// Sample user data
const users= {
    "12": {
        "name": "Rizwan",
        "username": "@rere",
        "img": "https://picsum.photos/20/20"
    },
    "13": {
        "name": "John Smith",
        "username": "@johnsmith",
        "img": "https://picsum.photos/20/20"
    },
    "14": {
        "name": "Jane Doe",
        "username": "@janedoe",
        "img": "https://picsum.photos/20/20"
    },
    "15": {
        "name": "Tom Brown",
        "username": "@tombrown",
        "img": "https://picsum.photos/20/20"
    },
    "16": {
        "name": "Sarah Davis",
        "username": "@sarahd",
        "img": "https://picsum.photos/20/20"
    },
    "17": {
        "name": "Michael Lee",
        "username": "@mikelee",
        "img": "https://picsum.photos/20/20"
    },
    "18": {
        "name": "Emily Green",
        "username": "@emgreen",
        "img": "https://picsum.photos/20/20"
    },
    "19": {
        "name": "David Wilson",
        "username": "@dwilson",
        "img": "https://picsum.photos/20/20"
    },
    "20": {
        "name": "Anna Taylor",
        "username": "@annat",
        "img": "https://picsum.photos/20/20"
    },
    "21": {
        "name": "Chris Johnson",
        "username": "@chrisj",
        "img": "https://picsum.photos/20/20"
    },
    "22": {
        "name": "Karen White",
        "username": "@kwhite",
        "img": "https://picsum.photos/20/20"
    },
    "23": {
        "name": "Paul Martinez",
        "username": "@paulm",
        "img": "https://picsum.photos/20/20"
    },
    "24": {
        "name": "Alice King",
        "username": "@alicek",
        "img": "https://picsum.photos/20/20"
    },
    "25": {
        "name": "Lucas Scott",
        "username": "@lucass",
        "img": "https://picsum.photos/20/20"
    },
    "26": {
        "name": "Nina Ross",
        "username": "@ninar",
        "img": "https://picsum.photos/20/20"
    },
    "27": {
        "name": "Oliver Brooks",
        "username": "@oliverb",
        "img": "https://picsum.photos/20/20"
    },
    "28": {
        "name": "Sophia Evans",
        "username": "@sophiae",
        "img": "https://picsum.photos/20/20"
    },
    "29": {
        "name": "Ethan Bell",
        "username": "@ethanb",
        "img": "https://picsum.photos/20/20"
    },
    "30": {
        "name": "Grace Adams",
        "username": "@gracea",
        "img": "https://picsum.photos/20/20"
    },
    "31": {
        "name": "Jacob Carter",
        "username": "@jacobc",
        "img": "https://picsum.photos/20/20"
    }
}




router.get('/issues', (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 6; // 6 issues per page
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Get search and filter values from the query parameters
    const searchValue = req.query.search || ''; // Default to an empty string if not provided
    const filterValue = req.query.filter || ''; // Default to an empty string if not provided
   
    // Filter the issues based on the search and filter values
    let filteredIssues = issues; // Assuming issues is your data source
    console.log(page + "" + searchValue + "" + filterValue);

    // Search logic
    if (searchValue) {
        filteredIssues = filteredIssues.filter(issue =>
            users[issue.userid].name.toLowerCase().includes(searchValue.toLowerCase()) ||
            users[issue.userid].username.toLowerCase().includes(searchValue.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchValue.toLowerCase())
        );
    }

    // Filter logic
    if (filterValue) {
        filteredIssues = filteredIssues.filter(issue => issue.status.toLowerCase() === filterValue.toLowerCase());
    }

    // Remove duplicates based on issue ID
    const uniqueIssues = Array.from(new Set(filteredIssues.map(issue => issue._id)))
        .map(id => filteredIssues.find(issue => issue._id === id));

    // Paginate the unique results
    const paginatedResults = uniqueIssues.slice(startIndex, endIndex).map(issue => {
        const user = users[issue.userid];
        return { ...issue, user };
    });

    res.json({
        currentPage: page,
        totalPages: Math.ceil(uniqueIssues.length / limit),
        totalIssues: uniqueIssues.length,
        data: paginatedResults
    });
});




router.get('/User/issues', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 6; // 6 issues per page
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Get search, filter, and userId values from the query parameters
    const searchValue = req.query.search || ''; // Default to an empty string if not provided
    const filterValue = req.query.filter || ''; // Default to an empty string if not provided
    const userId = req.query.userId; // Get userId from query

    try {
        // Build the query for fetching issues
        const query = { userId };

        // If searchValue is provided, modify the query to include search in description
        if (searchValue) {
            query.description = { $regex: searchValue, $options: 'i' }; // Case-insensitive search
        }

        // If filterValue is provided, add status filter
        if (filterValue) {
            query.status = filterValue;
        }

        // Fetch the issues from MongoDB
        const filteredIssues = await Issue.find(query)
            .skip(startIndex)
            .limit(limit)
            .populate('userId', 'name username img'); // Populate user details

        // Count total matching issues for pagination
        const totalIssues = await Issue.countDocuments(query);

        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalIssues / limit),
            totalIssues,
            data: filteredIssues,
        });
    } catch (error) {
        console.error('Error fetching issues:', error);
        res.status(500).json({ message: 'Server error' });
    }
});





router.get("/OverView", (req, res) => {
    res.status(200).send(overViewData);
});

router.get("/Statistics", (req, res) => {
    res.status(200).send(Issuestatistics);
});







module.exports = router;