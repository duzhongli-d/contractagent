-- CreateTable
CREATE TABLE "alipay_orders" (
    "id" TEXT NOT NULL,
    "out_trade_no" TEXT NOT NULL,
    "alipay_trade_no" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "tokenCount" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alipay_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "alipay_orders_out_trade_no_key" ON "alipay_orders"("out_trade_no");

-- CreateIndex
CREATE UNIQUE INDEX "alipay_orders_alipay_trade_no_key" ON "alipay_orders"("alipay_trade_no");
