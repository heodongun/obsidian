---
title: "NASA는 C 코드를 이렇게 짠다고? - C 코드 예시 "
description: "NASA의 공식 C언어 가이드를 번역한 글입니다."
source: "https://velog.io/@pobi/NASA%EB%8A%94-C-%EC%BD%94%EB%93%9C%EB%A5%BC-%EC%9D%B4%EB%A0%87%EA%B2%8C-%EC%A7%A0%EB%8B%A4%EA%B3%A0-C-%EC%BD%94%EB%93%9C-%EC%98%88%EC%8B%9C"
source_slug: "NASA는-C-코드를-이렇게-짠다고-C-코드-예시"
author: "pobi"
author_display_name: "포비"
released_at: "2025-10-08T04:51:41.182Z"
updated_at: "2026-03-14T12:57:11.484Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/9f1f4255-1c08-47cb-992b-5f33b6b3d91d/image.png"
tags: []
---# NASA는 C 코드를 이렇게 짠다고? - C 코드 예시 

다음 예시들은 이 문서에서 논의된 좋은 스타일의 많은 원칙들을 보여줍니다. 예시에는 다음이 포함됩니다:

- Makefile: 여러 실행 파일을 효율적으로 빌드하는 메커니즘을 제공
- .c 파일: 프로그램 파일 구성과 가독성 원칙을 보여줌
- include 파일: 상수와 외부 변수의 명확하고 유지보수 가능한 정의 및 구성을 보여줌

## 9.1 Makefile
```makefile
# Makefile for UIX Testing ..
#
# J. Programmer
#
# 이 makefile은 8개의 다른 실행 파일을 빌드할 수 있습니다.
# 실행 파일들은 동일한 코드와 라이브러리를 공유합니다.
#
# 실행 파일을 위한 오브젝트 코드
#
INIT_OBJS = oi_seq_init.o oi_seq_drv_1.o

GEN_SCREEN_OBJS = oi_seq_gen_screen_PRIVATE.o\
                  oi_seq_drv_1.o \
                  oi_seq_resize_pane.o\
                  oi_seq_get_pane_sizes_PRIVATE.o\
                  oi_seq_init.o

FATAL_OBJS = oi_seq_drv_2.o\
             oi_seq_fatal_PRIVATE.o

PROC_FOCUS_EVENTS_OBJS = oi_seq_drv_3.o\
                         oi_seq_proc_focus_events.o

LOAD_OBJS = oi_seq_load_drv.o\
            oi_seq_load.o\
            print_seq.o

SUB_BUILD_1 = \
    ol_seq_init.o\
    ol_seq_gen_screen_PRIVATE.o\
    ol_seq_resize_pane.o\
    om_seq_get_pane_sizes_PRIVATE.o\
    ol_seq_proc_focus_events.o\
    ol_seq_load.o\
    om_seq_change_exec_type.o\
    ol_seq_file_error_PRIVATE.o\
    om_seq_enable_sequence_PRIVATE.o\
    ol_seq_new_app_PRIVATE.o\
    ol_seq_prep_load.o\
    ol_seq_change_current_PRIVATE.o\
    ol_seq_set_detail_pane_PRIVATE.o\
    ol_seq_retrieve_detail_pane_PRIVATE.o\
    ol_seq_subbld_1.o

SUB_BUILD_2 = \
    oz_seq_init.o\
    ol_seq_gen_screen_PRIVATE.o\
    ol_seq_proc_focus_events.o\
    ol_seq_quit.o\
    om_seq_seqcr_spawn_PRIVATE.o\
    ol_seq_seqcr_continue.o\
    ol_seq_seqcr_handle_sigchld.o\
    ol_seq_seqcr_start.o\
    oz_seq_seqcr_term.o\
    ol_seq_load.o\
    ol_seq_change_exec_type.o\
    ol_seq_file_error_PRIVATE.o\
    ol_seq_enable_sequence_PRIVATE.o\
    om_seq_new_app_PRIVATE.o\
    ol_seq_prep_load.o\
    oz_seq_change_current_PRIVATE.o\
    ol_seq_set_detail_pane_PRIVATE.o\
    om_seq_retrieve_detail_pane_PRIVATE.o\
    ol_seq_new.o\
    ol_seq_remove_app.o\
    ol_seq_check_seq_ui.o\
    ol_seq_seqcr_check_seq_PRIVATE.o\
    oz_seq_insert_app.o\
    ol_seq_reconfigure_pane_PRIVATE.o\
    ol_seq_subbld_2.o

BUILD_2 = \
    ol_seq_change_current_PRIVATE.o\
    om_seq_change_exectype.o\
    ol_seq_enable_sequence_PRIVATE.o\
    ol_seq_fatal_PRIVATE.o\
    ol_seq_gen_screen_PRIVATE.o\
    oz_seq_init.o\
    oz_seq_load.o\
    ol_seq_new_app_PRIVATE.o\
    ol_seq_proc_focus_events.o\
    om_seq_quit.o\
    om_seq_retrieve_detail_pane_PRIVATE.o\
    ol_seq_save.o\
    ol_seq_set_detail_pane_PRIVATE.o\
    om_seq_seqcr_check_seq_PRIVATE.o\
    ol_seq_seqcr_continue.o\
    ol_seq_seqcr_handle_sigchld.o\
    om_seq_seqcr_spawn_PRIVATE.o\
    ol_seq_seqcr_start.o\
    om_seq_seqcr_term.o\
    om_seq_data.o\
    ol_seq_reconfigure_pane_PRIVATE.o\
    oi_seq_b2_stubs.o\
    oi_session_mgr_main.o

# 모든 실행 파일에 포함됨
OBJS = test_main.o oi_seq_data.o stubs.o

INTERNAL_DEFINES = -DTEST_NO_NCSS
DEFINES =
DEBUG = -g
CUSTOM_FLAGS = -posix -W3 -DXTFUNCPROTO -DFUNCPROTO

CFLAGS = $(DEBUG) $(CUSTOM_FLAGS) $(INCDIR) $(DEFINES) \
         $(INTERNAL_DEFINES)

# INCLUDE 경로
INCDIR = -I/u/cmps3/UIX/dev/include \
         -I/u/cmps3/UIX/codebase5/sco/source

# 라이브러리
NCSS_LIBS = #-lncss_c -lrpcsvc -lrpc -lsocket
XLIBS = -lXtXm_s -lXmu -lX11_s -lPW
UIXLIBDIR = -L/u/cmps3/UIX/R1/lib/sco -L/u/cmps3/UIX/dev/lib/sco
UIX_LIBS = -luixdiag -luixutil
UIX_LIBS2 = -lmsgr

# 실행 파일을 위한 컴파일
test_init: $(INIT_OBJS) $(OBJS)
	$(CC) -o test_init $(INIT_OBJS) $(OBJS) $(UIXLIBDIR) $(NCSS_LIBS)\
	$(UIX_LIBS) $(XLIBS)

test_gen_screen: $(GEN_SCREEN_OBJS) $(OBJS)
	$(CC) -o test_gen_screen $(GEN_SCREEN_OBJS) $(OBJS) $(UIXLIBDIR)\
	$(NCSS_LIBS) $(UIX_LIBS) $(XLIBS)

test_fatal: $(FATAL_OBJS) $(OBJS)
	$(CC) -o test_fatal $(FATAL_OBJS) $(OBJS) $(NCSS_LIBS) $(UIXLIBDIR)\
	$(UIX_LIBS) $(XLIBS)

test_proc_focus_events: $(PROC_FOCUS_EVENTS_OBJS) $(OBJS)
	$(CC) -o test_proc_focus_events $(PROC_FOCUS_EVENTS_OBJS) $(OBJS)\
	$(UIXLIBDIR) $(UIX_LIBS)

test_load: $(LOAD_OBJS) $(OBJS)
	$(CC) -o test_load $(LOAD_OBJS) $(OBJS)\
	$(UIXLIBDIR) $(UIX_LIBS) $(XLIBS)

sub_build_1: $(SUB_BUILD_1) $(OBJS)
	$(CC) -o $@ $(SUB_BUILD_1) $(OBJS) $(UIXLIBDIR) $(NCSS_LIBS)\
	$(UIX_LIBS) $(XLIBS)

sub_build_2: $(SUB_BUILD_2) $(OBJS)
	echo $(SUB_BUILD_2)
	$(CC) -o $@ $(SUB_BUILD_2) $(OBJS) $(UIXLIBDIR) $(NCSS_LIBS)\
	$(UIX_LIBS) $(XLIBS)

build_2: $(BUILD_2)
	$(CC) -o $@ $(BUILD_2) $(UIXLIBDIR) $(NCSS_LIBS)\
	$(UIX_LIBS) $(XLIBS)

clean:
	/bin/rm $(INIT_OBJS) $(OBJS) $(GEN_SCREEN_OBJS) $(FATAL_OBJS)\
	$(LOAD_OBJS) $(SUB_BUILD_1)

depend:
	makedepend -- $(CFLAGS) -- "/bin/ls *.c"

# DO NOT DELETE THIS LINE -- make depends on it.
# [makedepend가
