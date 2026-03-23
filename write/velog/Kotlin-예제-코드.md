---
title: "Kotlin 예제 코드"
description: "예제"
source: "https://velog.io/@pobi/Kotlin-%EC%98%88%EC%A0%9C-%EC%BD%94%EB%93%9C"
source_slug: "Kotlin-예제-코드"
author: "pobi"
author_display_name: "포비"
released_at: "2025-10-07T12:31:06.841Z"
updated_at: "2026-03-23T03:03:36.261Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/fa127cf9-3101-42cf-9a96-08a841c59fe6/image.webp"
tags: []
---# Kotlin 예제 코드

## 1. Extension Functions 실무 예시

### ResponseEntity 확장

```kotlin
fun <T> T.toOkResponse(): ResponseEntity<T> = ResponseEntity.ok(this)

fun <T> T.toCreatedResponse(): ResponseEntity<T> = 
    ResponseEntity.status(HttpStatus.CREATED).body(this)

fun <T> T.toNoContentResponse(): ResponseEntity<T> = 
    ResponseEntity.noContent().build()

fun String.toBadRequestResponse(): ResponseEntity<ErrorResponse> = 
    ResponseEntity.badRequest().body(ErrorResponse(this))

// 사용
@PostMapping("/users")
fun createUser(@RequestBody request: CreateUserRequest): ResponseEntity<UserResponse> {
    return userService.createUser(request).toCreatedResponse()
}

@GetMapping("/users/{id}")
fun getUser(@PathVariable id: Long): ResponseEntity<UserResponse> {
    return userService.findById(id)?.toOkResponse() 
        ?: ResponseEntity.notFound().build()
}
```

### Entity → DTO 변환 확장

```kotlin
// Entity
data class User(
    val id: Long,
    val email: String,
    val name: String,
    val role: UserRole,
    val createdAt: LocalDateTime
)

data class Order(
    val id: Long,
    val userId: Long,
    val items: List<OrderItem>,
    val totalAmount: Double,
    val status: OrderStatus
)

// Extension functions
fun User.toResponse(): UserResponse = UserResponse(
    id = this.id,
    email = this.email,
    name = this.name,
    role = this.role.name,
    createdAt = this.createdAt.toString()
)

fun User.toSummary(): UserSummary = UserSummary(
    id = this.id,
    name = this.name
)

fun List<User>.toResponse(): List<UserResponse> = 
    this.map { it.toResponse() }

fun Order.toResponse(): OrderResponse = OrderResponse(
    id = this.id,
    items = this.items.map { it.toResponse() },
    totalAmount = this.totalAmount,
    status = this.status.name
)

// Service에서 사용
class UserService(private val userRepository: UserRepository) {
    fun getAllUsers(): List<UserResponse> {
        return userRepository.findAll().toResponse()
    }
    
    fun getUserById(id: Long): UserResponse? {
        return userRepository.findById(id)?.toResponse()
    }
}
```

### Pageable 확장

```kotlin
fun Pageable.toPageRequest(defaultSize: Int = 20, maxSize: Int = 100): PageRequest {
    val safeSize = this.pageSize.coerceIn(1, maxSize)
    return PageRequest.of(this.pageNumber, safeSize, this.sort)
}

fun <T> Page<T>.toPageResponse(): PageResponse<T> = PageResponse(
    content = this.content,
    page = this.number,
    size = this.size,
    totalElements = this.totalElements,
    totalPages = this.totalPages,
    hasNext = this.hasNext(),
    hasPrevious = this.hasPrevious()
)

// Controller에서 사용
@GetMapping("/users")
fun getUsers(pageable: Pageable): ResponseEntity<PageResponse<UserResponse>> {
    val page = userService.getUsers(pageable.toPageRequest())
    return page.map { it.toResponse() }
        .toPageResponse()
        .toOkResponse()
}
```

### 검증 확장

```kotlin
fun String.isValidEmail(): Boolean = 
    this.matches(Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"))

fun String.isValidPhoneNumber(): Boolean = 
    this.matches(Regex("^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$"))

fun String.isStrongPassword(): Boolean = 
    this.length >= 8 && 
    this.any { it.isUpperCase() } && 
    this.any { it.isLowerCase() } && 
    this.any { it.isDigit() }

fun <T> List<T>.isNotNullOrEmpty(): Boolean = 
    this.isNotEmpty()

// 사용
data class RegisterRequest(
    val email: String,
    val password: String,
    val phoneNumber: String
) {
    fun validate() {
        require(email.isValidEmail()) { "올바른 이메일 형식이 아닙니다" }
        require(password.isStrongPassword()) { "비밀번호는 8자 이상, 대소문자와 숫자를 포함해야 합니다" }
        require(phoneNumber.isValidPhoneNumber()) { "올바른 전화번호 형식이 아닙니다" }
    }
}
```

### LocalDateTime 확장

```kotlin
fun LocalDateTime.toKoreanFormat(): String = 
    this.format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분"))

fun LocalDateTime.toIsoString(): String = 
    this.format(DateTimeFormatter.ISO_DATE_TIME)

fun LocalDateTime.isBeforeNow(): Boolean = 
    this.isBefore(LocalDateTime.now())

fun LocalDateTime.isAfterNow(): Boolean = 
    this.isAfter(LocalDateTime.now())

fun LocalDateTime.plusBusinessDays(days: Long): LocalDateTime {
    var date = this
    var addedDays = 0L
    while (addedDays < days) {
        date = date.plusDays(1)
        if (date.dayOfWeek != DayOfWeek.SATURDAY && date.dayOfWeek != DayOfWeek.SUNDAY) {
            addedDays++
        }
    }
    return date
}

// 사용
class OrderService {
    fun createOrder(request: CreateOrderRequest): Order {
        val deliveryDate = LocalDateTime.now().plusBusinessDays(3)
        return Order(
            estimatedDelivery = deliveryDate.toKoreanFormat()
        )
    }
}
```

### 숫자 포맷 확장

```kotlin
fun Int.toWon(): String = "${String.format("%,d", this)}원"
fun Long.toWon(): String = "${String.format("%,d", this)}원"
fun Double.toWon(): String = "${String.format("%,.0f", this)}원"

fun Double.toPercent(decimals: Int = 1): String = 
    "${String.format("%.${decimals}f", this * 100)}%"

fun Double.round(decimals: Int): Double {
    val multiplier = Math.pow(10.0, decimals.toDouble())
    return Math.round(this * multiplier) / multiplier
}

// 사용
data class OrderResponse(
    val id: Long,
    val totalAmount: Double,
    val discountRate: Double
) {
    val formattedAmount: String = totalAmount.toWon()
    val formattedDiscount: String = discountRate.toPercent()
}
```

---

## 2. Scope Functions 실무 예시

### let - Nullable 처리

```kotlin
@GetMapping("/users/{id}")
fun getUser(@PathVariable id: Long): ResponseEntity<UserResponse> {
    return userRepository.findById(id)?.let { user ->
        ResponseEntity.ok(user.toResponse())
    } ?: ResponseEntity.notFound().build()
}

@PostMapping("/orders")
fun createOrder(
    @RequestBody request: CreateOrderRequest,
    @AuthenticationPrincipal principal: UserPrincipal
): ResponseEntity<OrderResponse> {
    return userRepository.findById(principal.userId)?.let { user ->
        orderService.createOrder(user, request)
            .toResponse()
            .toCreatedResponse()
    } ?: ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
}

// 중첩 Nullable 처리
fun getOrderUser(orderId: Long): UserResponse? {
    return orderRepository.findById(orderId)
        ?.user
        ?.takeIf { it.isActive }
        ?.let { it.toResponse() }
}

// 체이닝
fun processPayment(orderId: Long): PaymentResult? {
    return orderRepository.findById(orderId)
        ?.let { order -> validateOrder(order) }
        ?.let { order -> calculateAmount(order) }
        ?.let { amount -> processPayment(amount) }
}
```

### apply - 객체 초기화

```kotlin
// Entity 생성
fun createUser(request: CreateUserRequest): User {
    return User().apply {
        email = request.email
        name = request.name
        password = passwordEncoder.encode(request.password)
        role = UserRole.USER
        status = UserStatus.ACTIVE
        createdAt = LocalDateTime.now()
        updatedAt = LocalDateTime.now()
    }
}

// Builder 패턴 대체
fun createHttpClient(): OkHttpClient {
    return OkHttpClient.Builder().apply {
        connectTimeout(30, TimeUnit.SECONDS)
        readTimeout(30, TimeUnit.SECONDS)
        writeTimeout(30, TimeUnit.SECONDS)
        addInterceptor(loggingInterceptor)
        addInterceptor(authInterceptor)
    }.build()
}

// QueryDSL
fun searchUsers(condition: UserSearchCondition): List<User> {
    return queryFactory.selectFrom(qUser).apply {
        condition.name?.let { where(qUser.name.contains(it)) }
        condition.email?.let { where(qUser.email.eq(it)) }
        condition.minAge?.let { where(qUser.age.goe(it)) }
        condition.maxAge?.let { where(qUser.age.loe(it)) }
    }.fetch()
}
```

### also - 로깅 및 사이드 이펙트

```kotlin
// 생성 로깅
fun createUser(request: CreateUserRequest): User {
    return User.from(request)
        .also { logger.info("사용자 생성 시작: ${it.email}") }
        .also { userRepository.save(it) }
        .also { logger.info("사용자 생성 완료: ${it.id}") }
        .also { eventPublisher.publish(UserCreatedEvent(it)) }
        .also { emailService.sendWelcomeEmail(it.email) }
}

// 검증 체이닝
fun registerUser(request: RegisterRequest): User {
    return request
        .also { it.validate() }
        .also { require(!userRepository.existsByEmail(it.email)) { "이미 존재하는 이메일" } }
        .let { User.from(it) }
        .also { userRepository.save(it) }
}

// 디버깅
fun fetchExternalData(url: String): String {
    return httpClient.get(url)
        .also { logger.debug("응답 크기: ${it.length} bytes") }
        .also { logger.debug("응답 헤더: ${it.substring(0, 100)}") }
        .also { metricsService.recordApiCall(url, it.length) }
}
```

### run - 복잡한 초기화 및 계산

```kotlin
// 복잡한 검증 로직
fun validateOrder(order: Order): Boolean {
    return order.run {
        items.isNotEmpty() &&
        totalAmount > 0 &&
        items.all { it.quantity > 0 } &&
        userId > 0 &&
        status == OrderStatus.PENDING
    }
}

// 통계 계산
fun calculateOrderStats(orders: List<Order>): OrderStats {
    return orders.run {
        OrderStats(
            totalCount = size,
            totalAmount = sumOf { it.totalAmount },
            averageAmount = map { it.totalAmount }.average(),
            maxAmount = maxOfOrNull { it.totalAmount } ?: 0.0,
            minAmount = minOfOrNull { it.totalAmount } ?: 0.0
        )
    }
}

// 복잡한 쿼리 조건
fun buildSearchQuery(condition: SearchCondition): BooleanExpression? {
    return condition.run {
        val expressions = mutableListOf<BooleanExpression>()
        
        keyword?.let { expressions.add(qUser.name.contains(it)) }
        email?.let { expressions.add(qUser.email.eq(it)) }
        minAge?.let { expressions.add(qUser.age.goe(it)) }
        status?.let { expressions.add(qUser.status.eq(it)) }
        
        expressions.reduceOrNull { acc, expr -> acc.and(expr) }
    }
}
```

### with - 여러 메서드 호출

```kotlin
// StringBuilder
fun generateHtmlReport(data: ReportData): String {
    return with(StringBuilder()) {
        append("<!DOCTYPE html>\n")
        append("<html>\n")
        append("<head><title>${data.title}</title></head>\n")
        append("<body>\n")
        append("<h1>${data.title}</h1>\n")
        data.sections.forEach { section ->
            append("<h2>${section.title}</h2>\n")
            append("<p>${section.content}</p>\n")
        }
        append("</body>\n")
        append("</html>")
        toString()
    }
}

// 설정 객체
fun configureDatabase(config: DatabaseConfig) {
    with(config) {
        require(host.isNotEmpty()) { "Host는 필수입니다" }
        require(port in 1..65535) { "Port는 1-65535 범위여야 합니다" }
        require(database.isNotEmpty()) { "Database 이름은 필수입니다" }
        require(username.isNotEmpty()) { "Username은 필수입니다" }
    }
}

// API 응답 빌더
fun buildApiResponse(data: Any): ApiResponse<Any> {
    return with(ApiResponseBuilder<Any>()) {
        success(true)
        data(data)
        timestamp(LocalDateTime.now())
        message("요청이 성공적으로 처리되었습니다")
        build()
    }
}
```

---

## 3. 고차 함수 실무 예시

### 트랜잭션 처리

```kotlin
fun <T> transaction(block: () -> T): T {
    val transaction = transactionManager.getTransaction(TransactionDefinition())
    return try {
        val result = block()
        transactionManager.commit(transaction)
        result
    } catch (e: Exception) {
        transactionManager.rollback(transaction)
        throw e
    }
}

// 사용
fun transferMoney(fromId: Long, toId: Long, amount: Double) {
    transaction {
        val fromAccount = accountRepository.findById(fromId)
        val toAccount = accountRepository.findById(toId)
        
        fromAccount.withdraw(amount)
        toAccount.deposit(amount)
        
        accountRepository.save(fromAccount)
        accountRepository.save(toAccount)
        
        transactionHistoryRepository.save(
            TransactionHistory(fromId, toId, amount)
        )
    }
}
```

### 재시도 로직

```kotlin
suspend fun <T> retry(
    times: Int = 3,
    delay: Long = 1000,
    backoff: Double = 2.0,
    block: suspend () -> T
): T {
    var currentDelay = delay
    repeat(times - 1) { attempt ->
        try {
            return block()
        } catch (e: Exception) {
            logger.warn("시도 ${attempt + 1} 실패: ${e.message}")
            kotlinx.coroutines.delay(currentDelay)
            currentDelay = (currentDelay * backoff).toLong()
        }
    }
    return block()
}

// 사용
suspend fun fetchUserData(userId: Long): User {
    return retry(times = 3, delay = 1000) {
        externalApiClient.getUser(userId)
    }
}

suspend fun processPayment(orderId: Long): PaymentResult {
    return retry(times = 5, delay = 2000, backoff = 1.5) {
        paymentGateway.charge(orderId)
    }
}
```

### 캐싱 래퍼

```kotlin
fun <K, V> cached(
    cache: MutableMap<K, V> = mutableMapOf(),
    loader: (K) -> V
): (K) -> V {
    return { key ->
        cache.getOrPut(key) { loader(key) }
    }
}

// 사용
class UserService(private val userRepository: UserRepository) {
    private val userCache = mutableMapOf<Long, User>()
    
    val getUserById = cached(userCache) { id ->
        userRepository.findById(id) ?: throw UserNotFoundException()
    }
    
    fun getUser(id: Long): User = getUserById(id)
}
```

### 검증 체이닝

```kotlin
typealias Validator<T> = (T) -> ValidationResult

sealed class ValidationResult {
    object Success : ValidationResult()
    data class Failure(val errors: List<String>) : ValidationResult()
}

fun <T> validate(
    value: T,
    vararg validators: Validator<T>
): ValidationResult {
    val errors = validators.mapNotNull { validator ->
        when (val result = validator(value)) {
            is ValidationResult.Success -> null
            is ValidationResult.Failure -> result.errors
        }
    }.flatten()
    
    return if (errors.isEmpty()) {
        ValidationResult.Success
    } else {
        ValidationResult.Failure(errors)
    }
}

// 검증 함수들
val emailValidator: Validator<String> = { email ->
    if (email.contains("@")) ValidationResult.Success
    else ValidationResult.Failure(listOf("올바른 이메일 형식이 아닙니다"))
}

val passwordValidator: Validator<String> = { password ->
    val errors = mutableListOf<String>()
    if (password.length < 8) errors.add("비밀번호는 8자 이상이어야 합니다")
    if (!password.any { it.isUpperCase() }) errors.add("대문자를 포함해야 합니다")
    if (!password.any { it.isDigit() }) errors.add("숫자를 포함해야 합니다")
    
    if (errors.isEmpty()) ValidationResult.Success
    else ValidationResult.Failure(errors)
}

// 사용
fun registerUser(email: String, password: String) {
    val emailResult = validate(email, emailValidator)
    val passwordResult = validate(password, passwordValidator)
    
    // 검증 실패 처리
}
```

### 조건부 실행

```kotlin
fun executeIf(condition: Boolean, block: () -> Unit) {
    if (condition) block()
}

fun <T> executeIfNotNull(value: T?, block: (T) -> Unit) {
    value?.let(block)
}

// 사용
class OrderService {
    fun processOrder(order: Order) {
        executeIf(order.isPaid) {
            shipOrder(order)
        }
        
        executeIf(order.totalAmount > 100000) {
            applyVipDiscount(order)
        }
        
        executeIfNotNull(order.couponCode) { code ->
            applyCoupon(order, code)
        }
    }
}
```

### 비즈니스 로직 조합

```kotlin
typealias OrderProcessor = (Order) -> Order

fun combineProcessors(vararg processors: OrderProcessor): OrderProcessor {
    return { order ->
        processors.fold(order) { currentOrder, processor ->
            processor(currentOrder)
        }
    }
}

// 개별 프로세서들
val calculateTotal: OrderProcessor = { order ->
    order.copy(totalAmount = order.items.sumOf { it.price * it.quantity })
}

val applyDiscount: OrderProcessor = { order ->
    val discount = if (order.totalAmount > 100000) 0.1 else 0.0
    order.copy(
        discountAmount = order.totalAmount * discount,
        finalAmount = order.totalAmount * (1 - discount)
    )
}

val calculateShipping: OrderProcessor = { order ->
    val shipping = if (order.finalAmount > 50000) 0.0 else 3000.0
    order.copy(shippingFee = shipping)
}

// 조합해서 사용
val processOrder = combineProcessors(
    calculateTotal,
    applyDiscount,
    calculateShipping
)

fun createOrder(request: CreateOrderRequest): Order {
    val order = Order.from(request)
    return processOrder(order)
}
```

---

## 4. Sealed Class 실무 예시

### API 응답 모델링

```kotlin
sealed class ApiResponse<out T> {
    data class Success<T>(
        val data: T,
        val message: String? = null,
        val statusCode: Int = 200
    ) : ApiResponse<T>()
    
    data class Error(
        val message: String,
        val errorCode: String,
        val statusCode: Int,
        val details: Map<String, Any>? = null
    ) : ApiResponse<Nothing>()
    
    object Loading : ApiResponse<Nothing>()
    
    data class Empty(
        val message: String = "데이터가 없습니다"
    ) : ApiResponse<Nothing>()
}

// Service
class UserService {
    suspend fun getUser(id: Long): ApiResponse<User> {
        return try {
            val user = userRepository.findById(id)
            if (user == null) {
                ApiResponse.Empty("사용자를 찾을 수 없습니다")
            } else {
                ApiResponse.Success(user)
            }
        } catch (e: Exception) {
            ApiResponse.Error(
                message = e.message ?: "알 수 없는 오류",
                errorCode = "USER_FETCH_ERROR",
                statusCode = 500
            )
        }
    }
}

// Controller
@GetMapping("/users/{id}")
suspend fun getUser(@PathVariable id: Long): ResponseEntity<*> {
    return when (val result = userService.getUser(id)) {
        is ApiResponse.Success -> 
            ResponseEntity.ok(result.data)
        is ApiResponse.Error -> 
            ResponseEntity.status(result.statusCode).body(result)
        is ApiResponse.Empty -> 
            ResponseEntity.notFound().build()
        is ApiResponse.Loading -> 
            ResponseEntity.status(HttpStatus.PROCESSING).build()
    }
}
```

### 결제 수단 모델링

```kotlin
sealed class PaymentMethod {
    data class CreditCard(
        val cardNumber: String,
        val cvv: String,
        val expiryMonth: Int,
        val expiryYear: Int,
        val cardHolderName: String
    ) : PaymentMethod() {
        fun getMaskedNumber(): String {
            return "**** **** **** ${cardNumber.takeLast(4)}"
        }
    }
    
    data class BankTransfer(
        val bankCode: String,
        val accountNumber: String,
        val accountHolder: String
    ) : PaymentMethod() {
        fun getMaskedAccount(): String {
            return "${accountNumber.take(3)}****${accountNumber.takeLast(3)}"
        }
    }
    
    data class KakaoPay(
        val kakaoId: String
    ) : PaymentMethod()
    
    data class NaverPay(
        val naverId: String
    ) : PaymentMethod()
    
    object Cash : PaymentMethod()
}

class PaymentService {
    fun processPayment(method: PaymentMethod, amount: Double): PaymentResult {
        return when (method) {
            is PaymentMethod.CreditCard -> {
                logger.info("신용카드 결제: ${method.getMaskedNumber()}")
                creditCardGateway.charge(
                    cardNumber = method.cardNumber,
                    cvv = method.cvv,
                    amount = amount
                )
            }
            is PaymentMethod.BankTransfer -> {
                logger.info("계좌이체: ${method.getMaskedAccount()}")
                bankTransferService.transfer(
                    bankCode = method.bankCode,
                    accountNumber = method.accountNumber,
                    amount = amount
                )
            }
            is PaymentMethod.KakaoPay -> {
                logger.info("카카오페이 결제")
                kakaoPayService.pay(method.kakaoId, amount)
            }
            is PaymentMethod.NaverPay -> {
                logger.info("네이버페이 결제")
                naverPayService.pay(method.naverId, amount)
            }
            is PaymentMethod.Cash -> {
                logger.info("현금 결제")
                PaymentResult.Success("현금 결제 완료")
            }
        }
    }
}
```

### 주문 상태 모델링

```kotlin
sealed class OrderStatus {
    object Pending : OrderStatus()
    
    data class PaymentConfirmed(
        val paidAt: LocalDateTime,
        val paymentMethod: String
    ) : OrderStatus()
    
    data class Preparing(
        val startedAt: LocalDateTime,
        val estimatedTime: Int
    ) : OrderStatus()
    
    data class Shipping(
        val shippedAt: LocalDateTime,
        val trackingNumber: String,
        val courier: String
    ) : OrderStatus()
    
    data class Delivered(
        val deliveredAt: LocalDateTime,
        val receivedBy: String
    ) : OrderStatus()
    
    data class Cancelled(
        val cancelledAt: LocalDateTime,
        val reason: String,
        val refundAmount: Double
    ) : OrderStatus()
    
    data class Failed(
        val failedAt: LocalDateTime,
        val reason: String
    ) : OrderStatus()
}

class OrderService {
    fun getStatusMessage(status: OrderStatus): String {
        return when (status) {
            is OrderStatus.Pending -> 
                "주문 대기 중"
            is OrderStatus.PaymentConfirmed -> 
                "결제 완료 (${status.paidAt.toKoreanFormat()})"
            is OrderStatus.Preparing -> 
                "준비 중 (예상 시간: ${status.estimatedTime}분)"
            is OrderStatus.Shipping -> 
                "배송 중 (${status.courier}, 송장번호: ${status.trackingNumber})"
            is OrderStatus.Delivered -> 
                "배송 완료 (${status.deliveredAt.toKoreanFormat()}, 수령인: ${status.receivedBy})"
            is OrderStatus.Cancelled -> 
                "취소됨 (사유: ${status.reason}, 환불: ${status.refundAmount.toWon()})"
            is OrderStatus.Failed -> 
                "실패 (사유: ${status.reason})"
        }
    }
    
    fun canCancel(status: OrderStatus): Boolean {
        return when (status) {
            is OrderStatus.Pending,
            is OrderStatus.PaymentConfirmed,
            is OrderStatus.Preparing -> true
            else -> false
        }
    }
    
    fun getRefundAmount(status: OrderStatus, originalAmount: Double): Double {
        return when (status) {
            is OrderStatus.Cancelled -> status.refundAmount
            is OrderStatus.Pending -> originalAmount
            is OrderStatus.PaymentConfirmed -> originalAmount
            is OrderStatus.Preparing -> originalAmount * 0.9  // 10% 수수료
            else -> 0.0
        }
    }
}
```

### 인증 결과 모델링

```kotlin
sealed class AuthResult {
    data class Success(
        val accessToken: String,
        val refreshToken: String,
        val expiresIn: Long,
        val user: User
    ) : AuthResult()
    
    object InvalidCredentials : AuthResult()
    
    data class AccountLocked(
        val lockedUntil: LocalDateTime,
        val reason: String
    ) : AuthResult()
    
    object EmailNotVerified : AuthResult()
    
    data class RequiresMfa(
        val methods: List<MfaMethod>
    ) : AuthResult()
    
    data class Error(
        val message: String,
        val code: String
    ) : AuthResult()
}

class AuthService {
    fun login(email: String, password: String): AuthResult {
        val user = userRepository.findByEmail(email) 
            ?: return AuthResult.InvalidCredentials
        
        if (!passwordEncoder.matches(password, user.password)) {
            loginAttemptService.recordFailure(email)
            return AuthResult.InvalidCredentials
        }
        
        if (user.isLocked) {
            return AuthResult.AccountLocked(
                lockedUntil = user.lockedUntil!!,
                reason = user.lockReason ?: "보안상의 이유"
            )
        }
        
        if (!user.emailVerified) {
            return AuthResult.EmailNotVerified
        }
        
        if (user.mfaEnabled) {
            return AuthResult.RequiresMfa(
                methods = user.mfaMethods
            )
        }
        
        val tokens = tokenService.generateTokens(user)
        return AuthResult.Success(
            accessToken = tokens.accessToken,
            refreshToken = tokens.refreshToken,
            expiresIn = tokens.expiresIn,
            user = user
        )
    }
}

@PostMapping("/auth/login")
fun login(@RequestBody request: LoginRequest): ResponseEntity<*> {
    return when (val result = authService.login(request.email, request.password)) {
        is AuthResult.Success -> 
            ResponseEntity.ok(LoginResponse(
                accessToken = result.accessToken,
                refreshToken = result.refreshToken,
                expiresIn = result.expiresIn
            ))
        is AuthResult.InvalidCredentials -> 
            ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse("이메일 또는 비밀번호가 올바르지 않습니다"))
        is AuthResult.AccountLocked -> 
            ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ErrorResponse(
                    "계정이 잠겼습니다. ${result.lockedUntil}까지 로그인할 수 없습니다"
                ))
        is AuthResult.EmailNotVerified -> 
            ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ErrorResponse("이메일 인증이 필요합니다"))
        is AuthResult.RequiresMfa -> 
            ResponseEntity.status(HttpStatus.PRECONDITION_REQUIRED)
                .body(MfaRequiredResponse(result.methods))
        is AuthResult.Error -> 
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse(result.message))
    }
}
```

---

## 5. Delegation 실무 예시

### lazy - 무거운 초기화 지연

```kotlin
class UserService {
    // 데이터베이스 연결 - 실제 사용 시점에 초기화
    private val dataSource: DataSource by lazy {
        logger.info("DataSource 초기화 중...")
        HikariDataSource(hikariConfig)
    }
    
    // Redis 클라이언트
    private val redisClient: RedisClient by lazy {
        logger.info("Redis 클라이언트 초기화 중...")
        RedisClient.create("redis://localhost:6379")
    }
    
    // Elasticsearch 클라이언트
    private val elasticsearchClient: RestHighLevelClient by lazy {
        logger.info("Elasticsearch 클라이언트 초기화 중...")
        RestHighLevelClient(
            RestClient.builder(HttpHost("localhost", 9200, "http"))
        )
    }
    
    fun getUser(id: Long): User {
        // 여기서 처음 dataSource가 초기화됨
        return dataSource.connection.use { conn ->
            // DB 쿼리
        }
    }
}

// 설정 파일 로드
class AppConfig {
    private val properties: Properties by lazy {
        Properties().apply {
            load(FileInputStream("config.properties"))
        }
    }
    
    val apiUrl: String by lazy { properties.getProperty("api.url") }
    val apiKey: String by lazy { properties.getProperty("api.key") }
    val timeout: Int by lazy { properties.getProperty("timeout").toInt() }
}

// 캐시
class CacheService {
    private val userCache: Map<Long, User> by lazy {
        logger.info("사용자 캐시 로딩 중...")
        userRepository.findAll().associateBy { it.id }
    }
    
    fun getUser(id: Long): User? = userCache[id]
}
```

### observable - 변경 감지 및 로깅

```kotlin
class Product {
    var price: Double by Delegates.observable(0.0) { prop, old, new ->
        logger.info("[${prop.name}] 가격 변경: $old원 -> $new원")
        
        if (new > old * 1.1) {
            eventPublisher.publish(PriceIncreasedEvent(this, old, new))
        }
        
        if (new < old * 0.9) {
            eventPublisher.publish(PriceDecreasedEvent(this, old, new))
        }
    }
    
    var stock: Int by Delegates.observable(0) { prop, old, new ->
        logger.info("[${prop.name}] 재고 변경: $old개 -> $new개")
        
        if (new < 10) {
            notificationService.sendLowStockAlert(this)
        }
        
        if (old == 0 && new > 0) {
            notificationService.sendRestockAlert(this)
        }
    }
}

// 주문 상태 변경 추적
class Order {
    var status: OrderStatus by Delegates.observable(OrderStatus.PENDING) { prop, old, new ->
        logger.info("주문 ${this.id} 상태 변경: $old -> $new")
        
        orderHistoryRepository.save(
            OrderHistory(
                orderId = this.id,
                oldStatus = old,
                newStatus = new,
                changedAt = LocalDateTime.now()
            )
        )
        
        when (new) {
            OrderStatus.CONFIRMED -> emailService.sendOrderConfirmation(this)
            OrderStatus.SHIPPED -> emailService.sendShippingNotification(this)
            OrderStatus.DELIVERED -> emailService.sendDeliveryConfirmation(this)
            else -> {}
        }
    }
}
```

### vetoable - 변경 검증

```kotlin
class BankAccount {
    var balance: Double by Delegates.vetoable(0.0) { _, old, new ->
        val isValid = new >= 0
        if (!isValid) {
            logger.error("❌ 잔액은 음수일 수 없습니다: $new")
        }
        isValid
    }
    
    fun withdraw(amount: Double): Boolean {
        val oldBalance = balance
        balance -= amount
        return balance != oldBalance  // 변경 성공 여부 반환
    }
}

// 사용자 나이 검증
class User {
    var age: Int by Delegates.vetoable(0) { _, old, new ->
        when {
            new < 0 -> {
                logger.error("나이는 음수일 수 없습니다")
                false
            }
            new > 150 -> {
                logger.error("나이가 너무 큽니다")
                false
            }
            new < old -> {
                logger.error("나이는 감소할 수 없습니다")
                false
            }
            else -> true
        }
    }
}

// 재고 변경 검증
class ProductInventory {
    var stock: Int by Delegates.vetoable(0) { _, old, new ->
        when {
            new < 0 -> {
                logger.error("재고는 음수일 수 없습니다")
                false
            }
            new > 10000 -> {
                logger.warn("재고가 너무 많습니다. 확인이 필요합니다")
                // 관리자에게 알림
                true
            }
            else -> true
        }
    }
}
```

### Custom Delegate - 데이터베이스 저장

```kotlin
class DbProperty<T>(
    private val key: String,
    private val default: T,
    private val repository: ConfigRepository
) {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): T {
        @Suppress("UNCHECKED_CAST")
        return repository.findByKey(key)?.value as? T ?: default
    }
    
    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: T) {
        repository.save(Config(key, value))
    }
}

class AppSettings(private val repository: ConfigRepository) {
    var apiUrl: String by DbProperty("api.url", "http://localhost", repository)
    var timeout: Int by DbProperty("timeout", 30, repository)
    var maxRetries: Int by DbProperty("max.retries", 3, repository)
    var enableCache: Boolean by DbProperty("enable.cache", true, repository)
}

// 사용
val settings = AppSettings(configRepository)
println(settings.apiUrl)  // DB에서 로드
settings.apiUrl = "https://api.example.com"  // DB에 저장
```

### Custom Delegate - Redis 캐시

```kotlin
class RedisCache<T>(
    private val key: String,
    private val ttl: Long,
    private val redisTemplate: RedisTemplate<String, T>
) {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): T? {
        return redisTemplate.opsForValue().get(key)
    }
    
    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: T?) {
        if (value != null) {
            redisTemplate.opsForValue().set(key, value, ttl, TimeUnit.SECONDS)
        } else {
            redisTemplate.delete(key)
        }
    }
}

class UserCache(private val redisTemplate: RedisTemplate<String, User>) {
    var currentUser: User? by RedisCache("user:current", 3600, redisTemplate)
    var userProfile: UserProfile? by RedisCache("user:profile", 7200, redisTemplate)
}
```

---

## 6. 함수형 프로그래밍 실무 예시

### groupBy - 데이터 그룹화

```kotlin
// 주문을 사용자별로 그룹화
fun getUserOrders(orders: List<Order>): Map<Long, List<Order>> {
    return orders.groupBy { it.userId }
}

// 주문을 상태별로 그룹화하고 통계 계산
fun getOrderStatsByStatus(orders: List<Order>): Map<OrderStatus, OrderStats> {
    return orders.groupBy { it.status }
        .mapValues { (_, orderList) ->
            OrderStats(
                count = orderList.size,
                totalAmount = orderList.sumOf { it.totalAmount },
                averageAmount = orderList.map { it.totalAmount }.average()
            )
        }
}

// 날짜별 매출 집계
fun getDailySales(orders: List<Order>): Map<LocalDate, Double> {
    return orders
        .filter { it.status == OrderStatus.COMPLETED }
        .groupBy { it.createdAt.toLocalDate() }
        .mapValues { (_, orderList) -> orderList.sumOf { it.totalAmount } }
}

// 상품 카테고리별 판매량
fun getSalesByCategory(orderItems: List<OrderItem>): Map<String, Int> {
    return orderItems
        .groupBy { it.product.category }
        .mapValues { (_, items) -> items.sumOf { it.quantity } }
}

// 나이대별 사용자 그룹화
fun getUsersByAgeGroup(users: List<User>): Map<String, List<User>> {
    return users.groupBy { user ->
        when (user.age) {
            in 0..19 -> "10대"
            in 20..29 -> "20대"
            in 30..39 -> "30대"
            in 40..49 -> "40대"
            else -> "50대 이상"
        }
    }
}
```

### partition - 조건별 분리

```kotlin
// 완료된 주문과 미완료 주문 분리
fun separateOrders(orders: List<Order>): Pair<List<Order>, List<Order>> {
    val (completed, incomplete) = orders.partition { 
        it.status == OrderStatus.COMPLETED 
    }
    return completed to incomplete
}

// 정상 재고와 부족 재고 분리
fun separateInventory(products: List<Product>): InventoryReport {
    val (normal, low) = products.partition { it.stock >= 10 }
    return InventoryReport(
        normalStock = normal,
        lowStock = low,
        outOfStock = products.filter { it.stock == 0 }
    )
}

// 활성 사용자와 비활성 사용자
fun separateUsers(users: List<User>): Pair<List<User>, List<User>> {
    return users.partition { it.lastLoginAt.isAfter(LocalDateTime.now().minusDays(30)) }
}

// 유효한 쿠폰과 만료된 쿠폰
fun separateCoupons(coupons: List<Coupon>): CouponReport {
    val (valid, expired) = coupons.partition { 
        it.expiresAt.isAfter(LocalDateTime.now()) 
    }
    return CouponReport(validCoupons = valid, expiredCoupons = expired)
}
```

### flatMap - 중첩 데이터 평탄화

```kotlin
// 모든 주문의 모든 상품 추출
fun getAllOrderedProducts(orders: List<Order>): List<Product> {
    return orders.flatMap { order ->
        order.items.map { it.product }
    }
}

// 사용자의 모든 권한 수집
data class User(val id: Long, val roles: List<Role>)
data class Role(val name: String, val permissions: List<Permission>)
data class Permission(val name: String)

fun getAllUserPermissions(user: User): List<Permission> {
    return user.roles.flatMap { it.permissions }
}

// 카테고리의 모든 하위 상품
data class Category(val name: String, val products: List<Product>)

fun getAllProducts(categories: List<Category>): List<Product> {
    return categories.flatMap { it.products }
}

// 주문의 모든 태그 수집
data class Order(val id: Long, val tags: List<String>)

fun getAllOrderTags(orders: List<Order>): List<String> {
    return orders.flatMap { it.tags }.distinct()
}

// 이메일 수신자 목록 생성
data class EmailGroup(val name: String, val members: List<String>)

fun getAllRecipients(groups: List<EmailGroup>): List<String> {
    return groups.flatMap { it.members }.distinct()
}
```

### reduce / fold - 집계

```kotlin
// 장바구니 총액 계산
fun calculateCartTotal(items: List<CartItem>): Double {
    return items.fold(0.0) { total, item ->
        total + (item.price * item.quantity)
    }
}

// 할인 적용 후 최종 금액
fun calculateFinalAmount(
    items: List<CartItem>,
    discountRate: Double,
    shippingFee: Double
): Double {
    val subtotal = items.fold(0.0) { acc, item ->
        acc + (item.price * item.quantity)
    }
    val discount = subtotal * discountRate
    return subtotal - discount + shippingFee
}

// 재고 합계
fun getTotalStock(products: List<Product>): Int {
    return products.fold(0) { total, product ->
        total + product.stock
    }
}

// 포인트 합산
data class Transaction(val amount: Double, val type: TransactionType)
enum class TransactionType { EARN, USE }

fun calculatePointBalance(transactions: List<Transaction>): Double {
    return transactions.fold(0.0) { balance, transaction ->
        when (transaction.type) {
            TransactionType.EARN -> balance + transaction.amount
            TransactionType.USE -> balance - transaction.amount
        }
    }
}

// 통계 계산
data class Stats(
    val count: Int = 0,
    val sum: Double = 0.0,
    val min: Double = Double.MAX_VALUE,
    val max: Double = Double.MIN_VALUE
) {
    val average: Double get() = if (count > 0) sum / count else 0.0
}

fun calculateStats(values: List<Double>): Stats {
    return values.fold(Stats()) { stats, value ->
        Stats(
            count = stats.count + 1,
            sum = stats.sum + value,
            min = minOf(stats.min, value),
            max = maxOf(stats.max, value)
        )
    }
}
```

### Sequence - 대용량 데이터 처리

```kotlin
// 대용량 주문 데이터 처리
fun processLargeOrderData(orders: Sequence<Order>): List<OrderSummary> {
    return orders
        .filter { it.status == OrderStatus.COMPLETED }
        .filter { it.totalAmount > 10000 }
        .map { order ->
            OrderSummary(
                orderId = order.id,
                userId = order.userId,
                totalAmount = order.totalAmount,
                orderDate = order.createdAt
            )
        }
        .take(1000)  // 상위 1000개만
        .toList()
}

// 대용량 로그 파일 처리
fun analyzeLogs(logFile: File): LogAnalysis {
    val lines = logFile.useLines { it }  // Sequence<String>
    
    val errorCount = lines
        .filter { it.contains("ERROR") }
        .count()
    
    val warningCount = lines
        .filter { it.contains("WARN") }
        .count()
    
    return LogAnalysis(errorCount, warningCount)
}

// 페이징된 데이터베이스 쿼리
fun getAllUsersSequence(): Sequence<User> = sequence {
    var page = 0
    val pageSize = 100
    
    while (true) {
        val users = userRepository.findAll(
            PageRequest.of(page, pageSize)
        ).content
        
        if (users.isEmpty()) break
        
        yieldAll(users)
        page++
    }
}

// 사용
fun exportActiveUsers(): List<UserExport> {
    return getAllUsersSequence()
        .filter { it.isActive }
        .map { it.toExport() }
        .toList()
}

// 무한 시퀀스 - 배치 작업
fun processInBatches(items: List<Item>, batchSize: Int) {
    items.asSequence()
        .chunked(batchSize)
        .forEachIndexed { index, batch ->
            logger.info("배치 ${index + 1} 처리 중...")
            processBatch(batch)
        }
}
```

### 실전 종합 예시

```kotlin
// 주문 리포트 생성
fun generateOrderReport(orders: List<Order>): OrderReport {
    // 상태별 그룹화
    val byStatus = orders.groupBy { it.status }
        .mapValues { (_, orders) ->
            StatusReport(
                count = orders.size,
                totalAmount = orders.sumOf { it.totalAmount }
            )
        }
    
    // 일별 매출
    val dailySales = orders
        .filter { it.status == OrderStatus.COMPLETED }
        .groupBy { it.createdAt.toLocalDate() }
        .mapValues { (_, orders) -> orders.sumOf { it.totalAmount } }
    
    // 상위 고객
    val topCustomers = orders
        .filter { it.status == OrderStatus.COMPLETED }
        .groupBy { it.userId }
        .mapValues { (_, orders) -> orders.sumOf { it.totalAmount } }
        .toList()
        .sortedByDescending { it.second }
        .take(10)
    
    // 인기 상품
    val popularProducts = orders
        .filter { it.status == OrderStatus.COMPLETED }
        .flatMap { it.items }
        .groupBy { it.productId }
        .mapValues { (_, items) -> items.sumOf { it.quantity } }
        .toList()
        .sortedByDescending { it.second }
        .take(10)
    
    return OrderReport(
        statusReport = byStatus,
        dailySales = dailySales,
        topCustomers = topCustomers,
        popularProducts = popularProducts
    )
}

// 사용자 분석
fun analyzeUsers(users: List<User>): UserAnalysis {
    val (active, inactive) = users.partition { 
        it.lastLoginAt.isAfter(LocalDateTime.now().minusDays(30)) 
    }
    
    val byAge = users.groupBy { user ->
        when (user.age) {
            in 0..19 -> "10대"
            in 20..29 -> "20대"
            in 30..39 -> "30대"
            in 40..49 -> "40대"
            else -> "50대 이상"
        }
    }
    
    val byRegion = users.groupBy { it.region }
        .mapValues { it.value.size }
    
    return UserAnalysis(
        totalUsers = users.size,
        activeUsers = active.size,
        inactiveUsers = inactive.size,
        ageDistribution = byAge.mapValues { it.value.size },
        regionDistribution = byRegion
    )
}
```

---

## 종합 실전 예제: REST API Controller

```kotlin
@RestController
@RequestMapping("/api/orders")
class OrderController(
    private val orderService: OrderService,
    private val userService: UserService
) {
    
    @PostMapping
    fun createOrder(
        @RequestBody request: CreateOrderRequest,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<OrderResponse> {
        return userService.findById(principal.userId)
            ?.let { user ->
                request.validate()  // Extension 사용
                
                orderService.createOrder(user, request)
                    .also { logger.info("주문 생성: ${it.id}") }  // also로 로깅
                    .toResponse()  // Extension으로 변환
                    .toCreatedResponse()  // Extension으로 응답
            }
            ?: "사용자를 찾을 수 없습니다".toBadRequestResponse()
    }
    
    @GetMapping
    fun getOrders(
        @AuthenticationPrincipal principal: UserPrincipal,
        pageable: Pageable
    ): ResponseEntity<PageResponse<OrderResponse>> {
        return orderService.getOrders(principal.userId, pageable.toPageRequest())
            .map { it.toResponse() }  // Page<Order> -> Page<OrderResponse>
            .toPageResponse()  // Extension
            .toOkResponse()  // Extension
    }
    
    @GetMapping("/{id}")
    fun getOrder(
        @PathVariable id: Long,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<OrderResponse> {
        return orderService.findById(id)
            ?.takeIf { it.userId == principal.userId }  // 권한 확인
            ?.let { it.toResponse().toOkResponse() }
            ?: ResponseEntity.notFound().build()
    }
    
    @DeleteMapping("/{id}")
    fun cancelOrder(
        @PathVariable id: Long,
        @RequestBody request: CancelOrderRequest,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<OrderResponse> {
        return when (val result = orderService.cancelOrder(id, principal.userId, request.reason)) {
            is ApiResponse.Success -> result.data.toResponse().toOkResponse()
            is ApiResponse.Error -> ResponseEntity.status(result.statusCode).body(null)
            else -> ResponseEntity.badRequest().build()
        }
    }
}
```

저도 이런 코드들을 바로바로 쓸수있도록 코드를 짤때 지피티나 클로드에게 이게 코틀린다운 코드냐고 물어봅니다. 그리고 아니라고 왜 그런지 고민하고 납득이 되지않으면 한참을싸우죠 그러면서 성장하는거겠죠 허허.
