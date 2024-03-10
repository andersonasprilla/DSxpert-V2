"use strict";

// Define KTCustomersList as a function that encapsulates our customer list logic
var KTCustomersList = function () {
    var dataTable, deleteSelectedBtn, paymentTypeFilters, tableElement;
    
    // Function to handle row deletion with confirmation using Swal
    var handleRowDeletion = function () {
        tableElement.querySelectorAll('[data-kt-customer-table-filter="delete_row"]').forEach((btn) => {
            btn.addEventListener("click", function (event) {
                event.preventDefault();
                const row = event.target.closest("tr");
                const customerName = row.querySelectorAll("td")[1].innerText;
                Swal.fire({
                    text: "Are you sure you want to delete " + customerName + "?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes, delete!",
                    cancelButtonText: "No, cancel",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then(function (result) {
                    if (result.value) {
                        Swal.fire({
                            text: "You have deleted " + customerName + "!",
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary"
                            }
                        }).then(function () {
                            dataTable.row($(row)).remove().draw();
                        });
                    } else if (result.dismiss === "cancel") {
                        Swal.fire({
                            text: customerName + " was not deleted.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary"
                            }
                        });
                    }
                });
            });
        });
    };

    // Function to handle the deletion of selected rows
    var handleSelectedRowsDeletion = function () {
        const checkboxes = tableElement.querySelectorAll('[type="checkbox"]');
        const deleteSelectedBtn = document.querySelector('[data-kt-customer-table-select="delete_selected"]');
        
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("click", function () {
                setTimeout(updateSelectionInfo, 50);
            });
        });
        
        deleteSelectedBtn.addEventListener("click", function () {
            Swal.fire({
                text: "Are you sure you want to delete selected customers?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, delete!",
                cancelButtonText: "No, cancel",
                customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary"
                }
            }).then(function (result) {
                if (result.value) {
                    Swal.fire({
                        text: "You have deleted all selected customers!",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary"
                        }
                    }).then(function () {
                        checkboxes.forEach((checkbox) => {
                            if (checkbox.checked) {
                                dataTable.row($(checkbox.closest("tbody tr"))).remove().draw();
                            }
                        });
                        tableElement.querySelectorAll('[type="checkbox"]')[0].checked = false;
                    });
                } else if (result.dismiss === "cancel") {
                    Swal.fire({
                        text: "Selected customers was not deleted.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary"
                        }
                    });
                }
            });
        });
    };

    // Function to update selection info (toolbar visibility and selected count)
    var updateSelectionInfo = function () {
        const baseToolbar = document.querySelector('[data-kt-customer-table-toolbar="base"]');
        const selectedToolbar = document.querySelector('[data-kt-customer-table-toolbar="selected"]');
        const selectedCountElem = document.querySelector('[data-kt-customer-table-select="selected_count"]');
        const checkboxes = tableElement.querySelectorAll('tbody [type="checkbox"]');
        
        let selectionExists = false, selectedCount = 0;
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                selectionExists = true;
                selectedCount++;
            }
        });
        
        if (selectionExists) {
            selectedCountElem.innerHTML = selectedCount;
            baseToolbar.classList.add("d-none");
            selectedToolbar.classList.remove("d-none");
        } else {
            baseToolbar.classList.remove("d-none");
            selectedToolbar.classList.add("d-none");
        }
    };

        // Initialization function to set up the DataTable and attach event handlers
        var init = function () {
            // Initialize the DataTable and store its instance
            tableElement = document.querySelector("#kt_customers_table");
            if (tableElement) {
                // Format date using moment.js for correct sorting
                tableElement.querySelectorAll("tbody tr").forEach((row) => {
                    const dateCell = row.querySelectorAll("td")[5];
                    const formattedDate = moment(dateCell.innerHTML, "DD MMM YYYY, LT").format();
                    dateCell.setAttribute("data-order", formattedDate);
                });
    
                dataTable = $(tableElement).DataTable({
                    info: false,
                    order: [],
                    columnDefs: [
                        { orderable: false, targets: 0 },
                        { orderable: false, targets: 6 }
                    ]
                });
    
                // Attach event handlers after table redraw
                dataTable.on("draw", function () {
                    handleSelectedRowsDeletion();
                    handleRowDeletion();
                    updateSelectionInfo();
                    // Initialize menu (if there's a need to init dynamic components)
                    KTMenu.init();
                });
    
                // Initial setup calls
                handleSelectedRowsDeletion();
                
                // Search filter
                document.querySelector('[data-kt-customer-table-filter="search"]').addEventListener("keyup", function (event) {
                    dataTable.search(event.target.value).draw();
                });
    
                // Month filter
                var monthFilter = $('[data-kt-customer-table-filter="month"]');
                // Payment type filters
                paymentTypeFilters = document.querySelectorAll('[data-kt-customer-table-filter="payment_type"] [name="payment_type"]');
                document.querySelector('[data-kt-customer-table-filter="filter"]').addEventListener("click", function () {
                    const month = monthFilter.val();
                    let paymentType = "";
                    paymentTypeFilters.forEach((filter) => {
                        if (filter.checked) {
                            paymentType = filter.value;
                        }
                    });
                    paymentType = paymentType === "all" ? "" : paymentType;
                    const searchQuery = `${month} ${paymentType}`;
                    dataTable.search(searchQuery).draw();
                });
    
                // Reset filter
                document.querySelector('[data-kt-customer-table-filter="reset"]').addEventListener("click", function () {
                    monthFilter.val(null).trigger("change");
                    paymentTypeFilters[0].checked = true;
                    dataTable.search("").draw();
                });
            }
        };
    
        // Expose the init function
        return {
            init: init
        };
    }();
    
    // Execute the init function when the DOM is fully loaded
    KTUtil.onDOMContentLoaded(function () {
        KTCustomersList.init();
    });
    
