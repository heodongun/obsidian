---
title: "Cordova깔기"
description: "html, css, javascript 가지고 앱을 만들수있다고???? 하지만 멍청한 나는 이 하나를 까는데 2시간이 넘는 시간이 걸리게 되고....이걸보는 사람들은 그런 걱정 안하게 내가 글로 작성해보겠다.참고로 맥용이다. 윈도우는 쉬우니 알아서 해라나의 성공경험 바"
source: "https://velog.io/@pobi/Cordova%EA%B9%94%EA%B8%B0"
source_slug: "Cordova깔기"
author: "pobi"
author_display_name: "포비"
released_at: "2024-07-25T07:11:29.373Z"
updated_at: "2026-03-21T19:20:29.710Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/ed34f1c0-96df-4a2a-8a13-662b756e547e/image.png"
tags: []
---# Cordova깔기

> html, css, javascript 가지고 앱을 만들수있다고???? 

### 그렇다 전지전능한 Cordova님은 무려 이 3가지로 간단하게 앱을 만들수있다. 
하지만 멍청한 나는 이 하나를 까는데 2시간이 넘는 시간이 걸리게 되고....
이걸보는 사람들은 그런 걱정 안하게 내가 글로 작성해보겠다.
**참고로 맥용이다. 윈도우는 쉬우니 알아서 해라**
나의 성공경험 바탕이기에 이게 정공법은 아니다.
<br><br>

# 1. Node.js, npm설치하기
npm은 진짜 꼭필요하니 무조건 다운받도록 하자.
노드도 언젠가 쓸일이 있을지 모르니 그냥 깔도록 하자.
``` 
node -v
npm -v
```
이걸 터미널에서 해서 잘 다운로드 됐는지 확인하자.
이거 안하고 나중에 다운로드 안됐다하면 진짜 
![](https://velog.velcdn.com/images/pobi/post/ed34f1c0-96df-4a2a-8a13-662b756e547e/image.png)
죽일거다.
<br><br>

# 2. Cordova를 깔자
```npm install -g cordova``` 
굳이 전역으로 안깔아도 되지만 나는 저렇게 해서 그냥 저렇게 깔도록하자.
이것도 아까 배웠듯이

```cordova -v```
이 코드를 사용해서 잘깔렸는지 확인하자.
이상한 질문이뜬다면 그냥 무시하자 솔직히 모르겠다.
<br><br>
# 3. Cordova 프로젝트 생성하기
```cordova create myApp com.example.myapp MyApp```
![](https://velog.velcdn.com/images/pobi/post/f285acaf-7493-4492-a1e2-aba994f76ba8/image.png)
이렇게 데스크탑 있는곳에 myApp이라는것이 생길것이다.
??? : 데스크탑안에 깔고싶은데요??
알아서 찾아보고 알아서 하자.
이제 이 아래가 중요하다.
<br><br>
# 4. 플랫폼을 추가하자
```
cd myApp
cordova platform add android
cordova platform add ios
```
자기가 안드로이드 할꺼다 안드로이드하고 ios할꺼다 ios 실행해라
플러그인은 알아서 해라

<br><br>

# 5. 안드로이드 스튜디오를 깔자
안드로이드 스튜디오는 신이며 나의 빛 나의 구원이다.
한때는 VSC로 할려했지만 도저히 해결되지 않아서 안드로이드 스튜디오로 갔다.
System Settings > Android SDK
이렇게 들어가서 SDK 필요한것을 다운로드 받는다.
<br><br>
# 6. 실행시키기(난 안됨)
```
cordova build android
cordova run android

cordova build ios
cordova run ios
```

이렇게 하면 된다는데 난 안된다.
그래서 안드로이드 스튜디오를 켜서 Myapp을 켜준다.
<br><br>
# 7. 실행시키기
![](https://velog.velcdn.com/images/pobi/post/f7012613-d355-4533-8830-73ea3aa924bb/image.png)
www안에 있는 파일들이 실행되는 파일이다.
수정할일있으면 www안에 것을 바꾸어 바꿀수있다.
<br><br>
# 8. 진짜 실행시키기
![](https://velog.velcdn.com/images/pobi/post/7714913d-4a60-43ec-bbce-86771685f9a2/image.png)

myApp안에 있는 platforms안에있는 안드로이드로 들어와준다.
파일열기를 하란 말이다.
<br><br>
# 9. 진짜찐 실행시키기
build.gradle 이파일을 읽고
Gradle 동기화가 자동으로 잘되있으면 자동으로 위쪽에 초록색 누가봐도
실행시키는 버튼이 활성화되있을것이다.

하지만 이것이 나는 안되어있었다. 내가 생긴 오류를 기반으로 어떤식으로
해야하는지 설명하겠다.<br><br>

# 10. 오류가 났어요

```
FAILURE: Build failed with an exception.

* Where:
Script '/Users/heodongun/myApp/platforms/android/CordovaLib/cordova.gradle' line: 73

* What went wrong:
A problem occurred evaluating script.
> No installed build tools found. Please install the Android build tools version 34.0.0.

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
> Get more help at https://help.gradle.org.

BUILD FAILED in 60ms
```
<br><br>
나는 이런 오류가 났었다.
이 오류는 다행히도 정말 간단한 오류이다.
빌드 도구가 다운이 안됐다는 소리이다.
이 오류로 보자면 34.0.0버전이 필요하지만 깔리지 않았다는 뜻이다.

**System Settings > Android SDK > SDK Tools**
이동한다.
show package detail을 클릭하여 버전을 다 보이게 한다.
34버전을 깔고 혹시모르니
Hide obsolete packages를 클릭하여
android SDK platform-tools를 깔도록하자
<br><br>
# 11. 찐찐찐찐막 
이제는 초록색 버튼이 활성화 되어있을것이다.
이것으로 실행시키면 이상한 뭐가 막 뜨면서 뭐가 보이면서
실행될것이다.
