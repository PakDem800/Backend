BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[AgentTbl] (
    [AgentID] INT NOT NULL IDENTITY(1,1),
    [RegistrationDate] DATETIME,
    [AgentName] NVARCHAR(100),
    [AgentCNICNo] NVARCHAR(100),
    [AgentFatherName] NVARCHAR(100),
    [CompanyName] NVARCHAR(100),
    [CompanyAddress] NVARCHAR(150),
    [OfficeNo] NVARCHAR(50),
    [Phone] NVARCHAR(50),
    [Email] NVARCHAR(50),
    [CommissionPercentage] INT,
    [DownPaymentCommission] INT,
    [InstallmentCommission] INT,
    [OpeningBalance] DECIMAL(18,2),
    [OpeningBalanceDate] DATETIME,
    CONSTRAINT [PK_AgentTbl] PRIMARY KEY CLUSTERED ([AgentID])
);

-- CreateTable
CREATE TABLE [dbo].[ChargesTypeTbl] (
    [ChargesSeniority] INT NOT NULL,
    [ChargesType] NCHAR(50),
    CONSTRAINT [PK_ChargesTypeTbl] PRIMARY KEY CLUSTERED ([ChargesSeniority])
);

-- CreateTable
CREATE TABLE [dbo].[DailyExpenditure] (
    [ExpenditureID] INT NOT NULL IDENTITY(1,1),
    [ExpDate] DATE,
    [Expenditure] INT,
    [Amount] INT,
    [Remarks] NVARCHAR(250),
    [ExpenditureNature] NVARCHAR(100),
    CONSTRAINT [PK_DailyExpenditure] PRIMARY KEY CLUSTERED ([ExpenditureID])
);

-- CreateTable
CREATE TABLE [dbo].[DealDetailTbl] (
    [DealDetailID] INT NOT NULL IDENTITY(1,1),
    [DealID] INT NOT NULL,
    [PlotNo] INT,
    [PlotPrice] DECIMAL(18,0),
    [PlotSize] NVARCHAR(150),
    [PlotLocation] NVARCHAR(150),
    [Qty] DECIMAL(18,0) NOT NULL,
    [Rate] DECIMAL(18,0) NOT NULL,
    CONSTRAINT [PK_InvoiceLineID] PRIMARY KEY CLUSTERED ([DealDetailID])
);

-- CreateTable
CREATE TABLE [dbo].[DealTbl] (
    [DealID] INT NOT NULL IDENTITY(1,1),
    [DealDate] DATE,
    [CustomerName] NVARCHAR(100),
    [ContactNo] NVARCHAR(100),
    [CNIC] NVARCHAR(100),
    [Address] NVARCHAR(200),
    CONSTRAINT [PK_DealTbl] PRIMARY KEY CLUSTERED ([DealID])
);

-- CreateTable
CREATE TABLE [dbo].[ExpenditureTbl] (
    [ExpenditureID] INT NOT NULL IDENTITY(1,1),
    [ExpDate] DATE,
    [Amount] INT,
    [Remarks] NVARCHAR(250),
    [ExpenditureNature] NVARCHAR(100),
    [PVNo] NVARCHAR(100),
    [ModeOfPayment] NVARCHAR(100),
    [ToPayee] NVARCHAR(100),
    [PayeeCNICNo] NVARCHAR(100),
    [MobileNo] NVARCHAR(100),
    [ExpenseID] INT,
    CONSTRAINT [PK_ExpenditureTbl] PRIMARY KEY CLUSTERED ([ExpenditureID])
);

-- CreateTable
CREATE TABLE [dbo].[ExpenseHeadsTbls] (
    [ExpenseID] INT NOT NULL IDENTITY(1,1),
    [ExpenseMainHead] NVARCHAR(100),
    [ExpenseSubHead] NVARCHAR(100),
    [ExpenseNature] NVARCHAR(100),
    CONSTRAINT [PK_ExpenseHeadsTbls] PRIMARY KEY CLUSTERED ([ExpenseID])
);

-- CreateTable
CREATE TABLE [dbo].[ledger_report] (
    [Application_No] INT NOT NULL,
    [Date] DATE NOT NULL,
    [File_No] NVARCHAR(150) NOT NULL,
    [Area] NVARCHAR(150) NOT NULL,
    [Phase] NVARCHAR(50) NOT NULL,
    [Block] NVARCHAR(50) NOT NULL,
    [Plot_No] NVARCHAR(50) NOT NULL,
    [Total_instalment] INT NOT NULL,
    [Plot_Location] NVARCHAR(50) NOT NULL,
    [Applicant_Name] NVARCHAR(50) NOT NULL,
    [S/O,D/O,W/O] NVARCHAR(50) NOT NULL,
    [Cnic] NVARCHAR(50) NOT NULL,
    [Contact_No] NVARCHAR(50) NOT NULL,
    [Permanent_Address] NVARCHAR(150) NOT NULL,
    [Postal_Address] NVARCHAR(150) NOT NULL,
    [NOK] NVARCHAR(50) NOT NULL,
    [[S/O,W/O,D/O] NVARCHAR(50) NOT NULL,
    [NOK_Relation] NVARCHAR(150) NOT NULL,
    [NOK_Address] NVARCHAR(150) NOT NULL,
    [Referance] NVARCHAR(50) NOT NULL,
    [Cell_No] NVARCHAR(50) NOT NULL,
    [Mode_Of_Payment] NVARCHAR(50) NOT NULL,
    [Total_Amount] BIGINT NOT NULL,
    [InvestorRate] BIGINT,
    [Down_Payment] BIGINT NOT NULL,
    [InvestorDownPayment] BIGINT,
    [InvestorMonthlyInstallment] INT,
    [Monthly_Instalment] NVARCHAR(50) NOT NULL,
    [Amount] BIGINT NOT NULL,
    [Datee] DATE NOT NULL,
    [Sur_charge] NVARCHAR(50) NOT NULL,
    [Received] BIGINT NOT NULL,
    [LTotal_Amount] BIGINT NOT NULL,
    [Balance_Amount] BIGINT NOT NULL,
    [Receipt] NVARCHAR(50) NOT NULL,
    [Remarks] NVARCHAR(50) NOT NULL,
    [CornerCharges] BIGINT,
    [GrandTotal] BIGINT,
    [NoteNo] NVARCHAR(100),
    [Agent] INT,
    [IsCurrentWith] BIT,
    [AgentName] NVARCHAR(100),
    [CommAmount] DECIMAL(18,2),
    [TotalCommission] BIGINT,
    [TotalCommReceived] BIGINT,
    [TotalBalanceComm] BIGINT,
    [DevelopmentChargesIncluded] BIT,
    [DevelopmentAmount] BIGINT,
    [DevelopmentChargesDate] DATETIME,
    [ReceiptCatgory] NVARCHAR(100)
);

-- CreateTable
CREATE TABLE [dbo].[MainAppForm] (
    [ApplicationNo] INT NOT NULL IDENTITY(1,1),
    [Date] DATE NOT NULL,
    [FileNo] NVARCHAR(10) NOT NULL,
    [FileType] NVARCHAR(100),
    [Area] NVARCHAR(50),
    [PlotNo] NVARCHAR(15),
    [PlotID] INT,
    [Phase] NVARCHAR(15),
    [Block] NVARCHAR(15),
    [Total_Installment] INT NOT NULL,
    [PlotLocation] NVARCHAR(50),
    [ApplicantName] NVARCHAR(100) NOT NULL,
    [FatherOrHusband] NVARCHAR(100) NOT NULL,
    [CNICNo] NVARCHAR(50),
    [ContactNo] NVARCHAR(50),
    [PermanentAddress] NVARCHAR(200) NOT NULL,
    [PostalAddress] NVARCHAR(200),
    [Nok] NVARCHAR(100) NOT NULL,
    [NoKFatherName] NVARCHAR(100),
    [NokSRelation] NVARCHAR(50),
    [NoKAddress] NVARCHAR(200),
    [Refrence] NVARCHAR(50),
    [ModeOfPayment] NVARCHAR(50),
    [InvestorAmount] BIGINT,
    [InvestorDownPayment] BIGINT,
    [TotalAmount] BIGINT NOT NULL,
    [DownPayment] BIGINT NOT NULL,
    [MonthlyInstallment] INT,
    [InvestorMonthlyInstallment] INT,
    [CornerCharges] BIGINT,
    [GrandTotal] BIGINT,
    [AppRemarks] NVARCHAR(150),
    [RefMobileNo] NVARCHAR(50),
    [Agent] INT,
    [CommissionPercentage] INT,
    [NoteNo] NVARCHAR(100),
    [IsActive] BIT,
    [IsPlotCancel] NVARCHAR(100),
    [IsCurrentWith] BIT,
    [PlotCategory] NVARCHAR(100),
    [Discount] BIGINT,
    [PossesionStatus] BIT,
    [SubAgent] INT,
    [SubAgentComm] INT,
    [Investor] INT,
    [Prepaired_By] INT,
    [Prepaired_by_Name] NVARCHAR(50),
    [TransferAmount] BIGINT,
    [TransferDate] DATETIME,
    [DevelopmentChargesIncluded] BIT,
    [DevelopmentAmount] BIGINT,
    [DevelopmentChargesDate] DATETIME,
    [UpdatedBy] INT,
    [RefundedStatus] BIT,
    [RefundDate] DATETIME,
    [DeductedAmount] BIGINT,
    [InstallmentsForRefund] INT,
    [RefundAmount] BIGINT,
    [registry_Ineqal_Charges] BIGINT,
    [Registry_Date] DATETIME,
    [Registry_Number] INT,
    [Inteqal_Number] INT,
    [inteqal_date] DATETIME,
    CONSTRAINT [PK_MainAppForm] PRIMARY KEY CLUSTERED ([ApplicationNo])
);

-- CreateTable
CREATE TABLE [dbo].[ModeOfPayment] (
    [ModeOfPaymentSerial] INT NOT NULL,
    [ModeOfPayment] NVARCHAR(50),
    CONSTRAINT [PK_ModeOfPayment] PRIMARY KEY CLUSTERED ([ModeOfPaymentSerial])
);

-- CreateTable
CREATE TABLE [dbo].[MonthWiseReport] (
    [Date] DATE NOT NULL,
    [Total_Received_Amount] BIGINT NOT NULL,
    [Office_Expence] BIGINT NOT NULL,
    [Net_Amount] BIGINT NOT NULL,
    [ReportID] INT NOT NULL IDENTITY(1,1),
    CONSTRAINT [PK__MonthWis__D5BD48E5BBB89695] PRIMARY KEY CLUSTERED ([ReportID])
);

-- CreateTable
CREATE TABLE [dbo].[PaymentSchedule] (
    [PaymentScheduleID] INT NOT NULL IDENTITY(1,1),
    [FileNo] INT,
    [DueDate] DATETIME,
    [MonthIyInstallement] BIGINT,
    [PaymentNature] NVARCHAR(100),
    CONSTRAINT [PK_PaymentSchedule] PRIMARY KEY CLUSTERED ([PaymentScheduleID])
);

-- CreateTable
CREATE TABLE [dbo].[PlotAllotmentTbl] (
    [PlotAllotmentID] INT NOT NULL IDENTITY(1,1),
    [AllotmentDate] DATE,
    [AllotmentTime] TIME,
    [FileNo] INT,
    [PlotID] INT,
    [IsActive] BIT,
    CONSTRAINT [PK_PlotAllotmentTbl] PRIMARY KEY CLUSTERED ([PlotAllotmentID])
);

-- CreateTable
CREATE TABLE [dbo].[PlotCancellationLetter] (
    [PlotCancelID] INT NOT NULL IDENTITY(1,1),
    [PlotID] INT,
    [CancellationDate] DATETIME,
    [AmountNotPaid] DECIMAL(18,0),
    [ReasonForCancellation] NVARCHAR(max),
    CONSTRAINT [PK_PlotCancellationLetter] PRIMARY KEY CLUSTERED ([PlotCancelID])
);

-- CreateTable
CREATE TABLE [dbo].[PlotLocationTbl] (
    [PlotLocationSerial] INT NOT NULL,
    [PlotLocation] NVARCHAR(50),
    CONSTRAINT [PK_PlotLocationTbl] PRIMARY KEY CLUSTERED ([PlotLocationSerial])
);

-- CreateTable
CREATE TABLE [dbo].[PlotPrice] (
    [PlotPriceID] INT NOT NULL IDENTITY(1,1),
    [PlotCategory] NVARCHAR(100),
    [PlotSize] NVARCHAR(100),
    [PriceDate] DATETIME,
    [PlotPrice] BIGINT,
    [TokenMoney] BIGINT,
    [ConfirmationAdvance] BIGINT,
    [MonthlyInstallment] BIGINT,
    [QuarterlyInstallment] BIGINT,
    [TotalInstallmentQuarterly] BIGINT,
    [TotalMonthlyInstallments] BIGINT,
    [Extra15Percent] BIGINT,
    CONSTRAINT [PK_PlotPrice] PRIMARY KEY CLUSTERED ([PlotPriceID])
);

-- CreateTable
CREATE TABLE [dbo].[PlotSerials] (
    [PlotNoSerial] INT NOT NULL,
    [PlotBlockAndPhase] NVARCHAR(50),
    CONSTRAINT [PK_PlotSerials] PRIMARY KEY CLUSTERED ([PlotNoSerial])
);

-- CreateTable
CREATE TABLE [dbo].[PlotsTbl] (
    [PlotID] INT NOT NULL IDENTITY(1,1),
    [ProjectID] INT,
    [PlotPrice] INT NOT NULL,
    [PlotNo] INT,
    [Plots] NVARCHAR(100),
    [PlotSize] NVARCHAR(100),
    [Street] NVARCHAR(100),
    [Phase] NVARCHAR(100),
    [Block] NVARCHAR(100),
    [Category] NVARCHAR(100),
    [PlotLocation] NVARCHAR(100),
    [Amount] BIGINT,
    [PlotStatus] NVARCHAR(100),
    [sold] BIT,
    [TokenMoney] BIGINT,
    [CornfirmationAdvance] BIGINT,
    [MonthlyInstallment] BIGINT,
    [QuarterlyInstallment] BIGINT,
    [Extra15Percent] BIGINT,
    [TotalQuarterlyInstallment] BIGINT,
    [TotalMonthlyInstallment] BIGINT,
    CONSTRAINT [PK_PlotsTbl] PRIMARY KEY CLUSTERED ([PlotID])
);

-- CreateTable
CREATE TABLE [dbo].[ReceiptTbl] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [ReceiptNo] INT NOT NULL,
    [FileNo] NCHAR(10),
    [Date] DATE NOT NULL,
    [ReceivedAmount] BIGINT NOT NULL,
    [ReceivedDifferenceAmount] BIGINT,
    [ReceivedFrom] NVARCHAR(50),
    [Amount_For_The_Month_Of] NVARCHAR(100),
    [AmountReceivedForPlot] NVARCHAR(100) NOT NULL,
    [ModeOfPayment] NVARCHAR(50) NOT NULL,
    [Receipt] INT NOT NULL,
    [Phase] NVARCHAR(150),
    [Block] NVARCHAR(150),
    [Plot_No] NVARCHAR(50),
    [Prepaired_By] INT NOT NULL,
    [Prepaired_by_Name] NVARCHAR(50) NOT NULL,
    [Remarks] NVARCHAR(100),
    [Balancamount] DECIMAL(18,5),
    [ReceiptCatgory] NVARCHAR(100),
    [ReceiptStatus] NVARCHAR(100),
    [NextDueDate] DATETIME,
    [AgentID] INT,
    [AgentName] NVARCHAR(100),
    [CommAmount] DECIMAL(18,2),
    [CommRemarks] NVARCHAR(100),
    [ReceiptType] INT,
    [Online_Method] VARCHAR(50),
    [Method_ID] VARCHAR(50),
    CONSTRAINT [PK_ReceiptTbl] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[RefrenceTbl] (
    [ReferenceNo] INT NOT NULL,
    [RefrenceName] NVARCHAR(50),
    [RefrenceMobile] NCHAR(10),
    [Address] NVARCHAR(150),
    CONSTRAINT [PK_RefrenceTbl] PRIMARY KEY CLUSTERED ([ReferenceNo])
);

-- CreateTable
CREATE TABLE [dbo].[RefundTbl] (
    [RefundID] INT NOT NULL IDENTITY(1,1),
    [ApplicationNo] INT,
    [RefundDate] DATETIME,
    [RefundAmount] BIGINT,
    [Installment] NVARCHAR(100),
    [ModeofPayment] NVARCHAR(100),
    [Remarks] NVARCHAR(max),
    CONSTRAINT [PK_RefundTbl] PRIMARY KEY CLUSTERED ([RefundID])
);

-- CreateTable
CREATE TABLE [dbo].[RegistrationRoles] (
    [RolesID] INT NOT NULL IDENTITY(1,1),
    [Roles] NVARCHAR(100),
    CONSTRAINT [PK_RegistrationRoles] PRIMARY KEY CLUSTERED ([RolesID])
);

-- CreateTable
CREATE TABLE [dbo].[RegistrationTbl] (
    [RegisterationID] INT NOT NULL IDENTITY(1,1),
    [RegistrationDate] DATETIME,
    [Name] NVARCHAR(100),
    [CNICNo] NVARCHAR(100),
    [SpouseName] NVARCHAR(100),
    [CompanyName] NVARCHAR(100),
    [CompanyAddress] NVARCHAR(200),
    [OfficeNo] NVARCHAR(100),
    [ContactNo] NVARCHAR(100),
    [Email] NVARCHAR(100),
    [RegistrationAs] INT,
    [UserName] NVARCHAR(100),
    [Password] NVARCHAR(100),
    CONSTRAINT [PK_RegistrationTbl] PRIMARY KEY CLUSTERED ([RegisterationID])
);

-- CreateTable
CREATE TABLE [dbo].[RolesTbls] (
    [RolesID] INT NOT NULL IDENTITY(1,1),
    [Roles] NVARCHAR(100),
    CONSTRAINT [PK_RolesTbls] PRIMARY KEY CLUSTERED ([RolesID])
);

-- CreateTable
CREATE TABLE [dbo].[sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(max),
    CONSTRAINT [PK__sysdiagr__C2B05B61418E6405] PRIMARY KEY CLUSTERED ([diagram_id]),
    CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED ([principal_id],[name])
);

-- CreateTable
CREATE TABLE [dbo].[testtable] (
    [ApplicationNo] INT NOT NULL,
    [Applicant_Name] NVARCHAR(150) NOT NULL,
    [Date] DATE NOT NULL,
    [File_No] NVARCHAR(150) NOT NULL,
    [Phase] NVARCHAR(150),
    [Receipt] INT NOT NULL,
    [Receivied_Amount] BIGINT NOT NULL,
    [Mode_Of_Payment] NVARCHAR(50) NOT NULL,
    [Agent] NVARCHAR(100),
    [Remarks] NCHAR(10),
    [ReceiptCatgory] NVARCHAR(100),
    [AgentID] INT,
    [AgentName] NVARCHAR(100),
    [CommAmount] DECIMAL(18,2),
    [id] INT NOT NULL IDENTITY(1,1),
    CONSTRAINT [PK_testtable] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[UsersTbl] (
    [UserID] INT NOT NULL IDENTITY(1,1),
    [UserName] VARCHAR(50),
    [Password] VARCHAR(15),
    [RolesID] INT,
    [LoginDateTime] DATETIME,
    [IPAdderss] NVARCHAR(100),
    CONSTRAINT [PK_UsersTbl] PRIMARY KEY CLUSTERED ([UserID])
);

-- CreateTable
CREATE TABLE [dbo].[VoucherTbl] (
    [VoucherID] INT NOT NULL IDENTITY(1,1),
    [FileNo] INT NOT NULL,
    [VoucherDate] DATE,
    [Agent] INT,
    [Amount] INT,
    [Description] NVARCHAR(200),
    [CommissionPercentage] INT,
    [CommissionType] NVARCHAR(100),
    [BBF] DECIMAL(18,2),
    [VoucherNo] NVARCHAR(100),
    CONSTRAINT [PK_VoucherTbl] PRIMARY KEY CLUSTERED ([VoucherID])
);

-- AddForeignKey
ALTER TABLE [dbo].[DealDetailTbl] ADD CONSTRAINT [FK_DealDetailTbl_DealTbl] FOREIGN KEY ([DealID]) REFERENCES [dbo].[DealTbl]([DealID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ExpenditureTbl] ADD CONSTRAINT [FK_ExpenditureTbl_ExpenseHeadsTbls] FOREIGN KEY ([ExpenseID]) REFERENCES [dbo].[ExpenseHeadsTbls]([ExpenseID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MainAppForm] ADD CONSTRAINT [FK_MainAppForm_AgentTbl] FOREIGN KEY ([Investor]) REFERENCES [dbo].[AgentTbl]([AgentID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MainAppForm] ADD CONSTRAINT [FK_MainAppForm_AgentTbl1] FOREIGN KEY ([SubAgent]) REFERENCES [dbo].[AgentTbl]([AgentID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MainAppForm] ADD CONSTRAINT [FK_MainAppForm_RegistrationTbl] FOREIGN KEY ([Investor]) REFERENCES [dbo].[RegistrationTbl]([RegisterationID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PaymentSchedule] ADD CONSTRAINT [FK_PaymentSchedule_MainAppForm] FOREIGN KEY ([FileNo]) REFERENCES [dbo].[MainAppForm]([ApplicationNo]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PlotAllotmentTbl] ADD CONSTRAINT [FK_PlotAllotmentTbl_MainAppForm] FOREIGN KEY ([FileNo]) REFERENCES [dbo].[MainAppForm]([ApplicationNo]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PlotAllotmentTbl] ADD CONSTRAINT [FK_PlotAllotmentTbl_PlotsTbl] FOREIGN KEY ([PlotID]) REFERENCES [dbo].[PlotsTbl]([PlotID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PlotCancellationLetter] ADD CONSTRAINT [FK_PlotCancellationLetter_MainAppForm] FOREIGN KEY ([PlotID]) REFERENCES [dbo].[MainAppForm]([ApplicationNo]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RefundTbl] ADD CONSTRAINT [FK_RefundTbl_MainAppForm] FOREIGN KEY ([ApplicationNo]) REFERENCES [dbo].[MainAppForm]([ApplicationNo]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UsersTbl] ADD CONSTRAINT [FK_UsersTbl_RolesTbls] FOREIGN KEY ([RolesID]) REFERENCES [dbo].[RolesTbls]([RolesID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[VoucherTbl] ADD CONSTRAINT [FK_VoucherTbl_AgentTbl] FOREIGN KEY ([Agent]) REFERENCES [dbo].[AgentTbl]([AgentID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[VoucherTbl] ADD CONSTRAINT [FK_VoucherTbl_MainAppForm] FOREIGN KEY ([FileNo]) REFERENCES [dbo].[MainAppForm]([ApplicationNo]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

