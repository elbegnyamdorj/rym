from multiprocessing import managers
from django.contrib.auth.models import User
from django.db.models.fields import EmailField
from django.core import serializers as core_serializers
from django.utils.functional import Promise
from rest_framework import permissions, status
from rest_framework import response
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from itertools import groupby
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from .models import *
import json


class ObtainTokenPair(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = MyTokenObtainPairSerializer


class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserCreate(APIView):
    """
        Хэрэглэгч бүртгэх класс. Өмнө нь бүртгэлгүй байсан бол шууд бүртгэнэ.
        Хэрэв багш Group-д нэмэхдээ бүртэгсэн бол тухайн мөр бичлэгийг олон update хийнэ.
    """
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = Users.objects._create_user(**serializer.data)
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)

        elif Users.objects.filter(email=request.data['email']).exists():
            user = Users.objects.get(email=request.data['email'])
            us_serializer = UserSerializer(user)
            password = us_serializer.data['password']
            if password == "":
                user = Users.objects.create_preuser(**request.data)
                json = {'msg': 'succesfully created pre user'}
                return Response(json)

            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Groups(APIView):
    """
        Групп үүсгэхэд шаардлагатай утгуудыг авч үүсгэнэ.
        Группд хамаарах оюутан бүртгэлтэй эсэхийг шалгаж бүртгэлгүй тохиолдолд зөвхөн email багана нь утгатай
        шинэ бичлэг Users дотор үүсгэн id-г нь GroupStudents-рүү ref болгон өгнө.
    """

    ### permission classuud daraa n ustgah ###
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request, format='json'):
        data = request.query_params['teacher_id']
        try:
            groups = Group.objects.filter(teacher_id=data)
        except Group.DoesNotExist:
            groups = None
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)

    def post(self, request, format='json'):
        data = request.data
        print(data)
        students = data['student_list'].strip()
        stud_list = list(students.split("\n"))
        stud_list = [i.strip() for i in stud_list]
        data.pop('student_list')
        print(stud_list)
        serializer = GroupSerializer(data=data)
        if serializer.is_valid():
            group = serializer.save()

            for i in stud_list:
                user = Users.objects.get_or_create(email=i.strip(), defaults={
                                                   'email': i, 'user_type_id': UserType.objects.get(user_type_name='Оюутан')})
                if user:
                    user = Users.objects.get(email=i)
                    GroupStudents.objects.create(
                        student_id=user, group_id=group)
                else:
                    Users.object._create_user(email=i)

            if group:
                json = serializer.data
                json['id'] = group.id
                return Response(json, status=status.HTTP_201_CREATED)


class GroupStudentGetStudent(APIView):
    ### permission classuud daraa n ustgah ###
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request, format='json'):
        data = request.query_params['student_id']

        try:
            subgroups = GroupStudents.objects.filter(student_id=data)
            serializer = GroupStudentSerializer(subgroups, many=True)

            id_list = [i['group_id'] for i in serializer.data]
            students = Group.objects.filter(id__in=id_list)
            serializer = GroupSerializer(students, many=True)
        except GroupStudents.DoesNotExist:
            subgroups = None
            serializer = GroupStudentSerializer(subgroups, many=True)
        return Response(serializer.data)


class GroupStudent(APIView):
    ### permission classuud daraa n ustgah ###
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request, format='json'):
        data = request.query_params['group_id']

        try:
            subgroups = GroupStudents.objects.filter(group_id=data)
            serializer = GroupStudentSerializer(subgroups, many=True)

            id_list = [i['student_id'] for i in serializer.data]
            students = Users.objects.filter(id__in=id_list)
            serializer = UserSerializer(students, many=True)
        except GroupStudents.DoesNotExist:
            subgroups = None
            serializer = GroupStudentSerializer(subgroups, many=True)
        return Response(serializer.data)


class SubGroups(APIView):
    ### permission classuud daraa n ustgah ###
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request, format='json'):
        data = request.query_params['group_id']

        try:
            subgroups = SubGroup.objects.filter(group_id=data)
        except SubGroup.DoesNotExist:
            subgroups = None
        serializer = SubGroupSerializer(subgroups, many=True)
        return Response(serializer.data)

    def post(self, request, format='json'):
        data = request.data
        print(data)
        serializer = SubGroupSerializer(data=data)
        print(serializer)
        if serializer.is_valid():
            subgroup = serializer.save()

            if subgroup:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TeamMembers(APIView):
    ### permission classuud daraa n ustgah ###
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request, format='json'):
        data = request.query_params['subgroup_id']
        try:
            team_members = TeamMember.objects.filter(subgroup_id=data)
            serializer = TeamMemberSerializer(team_members, many=True)
            data = serializer.data
            team_members = json.loads(json.dumps(data))
            for i in team_members:
                student = GroupStudents.objects.filter(
                    id=i['group_student_id'])
                student_serializer = GroupStudentSerializer(student, many=True)
                student_info = dict(student_serializer.data[0])
                more_info_student = Users.objects.filter(
                    id=student_info['student_id'])
                s_more_info_serializer = UserSerializer(
                    more_info_student, many=True)

                student_more_info = dict(s_more_info_serializer.data[0])
                i['student_info'] = student_more_info
            final_data = [{'id': i['id'], 'team_name':i['team_name'], 'email':i['student_info']['email'],
                           'first_name':i['student_info']['first_name'], 'last_name':i['student_info']['last_name'], }for i in team_members]
            d = {}
            for item in final_data:
                d.setdefault(item['team_name'], []).append(item)

            list(d.values())
            return Response(d)
        except GroupStudents.DoesNotExist:
            teammembers = None
            serializer = TeamMemberSerializer(teammembers, many=True)
            return Response(serializer.data)

    def post(self, request, format='json'):
        data = request.data
        subgroup_id = data['subgroup_id']
        group_id = data['group_id']
        raw_list = data['team_list']
        updated_list = []
        for i in raw_list:
            for j in i['selected']:
                updated_list.append({'team_name': str(i['id'])+'-р баг',
                                    'subgroup_id': subgroup_id,
                                     'group_student_id': GroupStudents.objects.filter(student_id=j['value'], group_id=group_id).values_list('pk', flat=True)[0]})
        for team in updated_list:
            serializer = TeamMemberSerializer(data=team)
            json = ''
            if serializer.is_valid():
                team_member = serializer.save()

                if team_member:
                    json = serializer.data
        return Response(json, status=status.HTTP_201_CREATED)


class MyTeam(APIView):

    ### permission classuud daraa n ustgah ###
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request, format='json'):
        subgroup_id = request.query_params['subgroup_id']
        student_id = request.query_params['user_id']
        group_id = request.query_params['group_id']
        team_list = []
        try:
            student = GroupStudents.objects.filter(student_id=student_id)
            student_serializer = GroupStudentSerializer(student, many=True)
            team = TeamMember.objects.get(
                group_student_id=GroupStudents.objects.get(student_id=student_id, group_id=group_id), subgroup_id=subgroup_id)
            print(team)
            serializer = TeamMemberSerializer(team)
            data = serializer.data
            student_info = json.loads(json.dumps(data))
            team_members = TeamMember.objects.filter(
                subgroup_id=student_info['subgroup_id'], team_name=student_info['team_name']).values()
            for i in team_members:
                std_id = GroupStudents.objects.filter(id=i['group_student_id_id']).values()[
                    0]['student_id_id']
                student_info = Users.objects.get(id=std_id)
                serializer = UserSerializer(student_info)
                student_data = serializer.data
                if student_data['id'] != int(student_id):
                    team_list.append({'first_name': student_data['first_name'],
                                      'last_name': student_data['last_name'],
                                      'student_id': student_data['id'],
                                      'group_student_id': i['group_student_id_id'],
                                      'team_member_id': i['id'],
                                      'email': student_data['email']})
            real_final_shit = {
                'team_name': team_members[0]['team_name'], 'team_members': team_list}
            return Response(real_final_shit)
        except GroupStudents.DoesNotExist:
            teammembers = None
            serializer = TeamMemberSerializer(teammembers, many=True)
            return Response(serializer.data)


class Teams(APIView):
    ### permission classuud daraa n ustgah ###
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    # def get(self, request, format='json'):
    #     data = request.query_params['group_id']

    #     try:
    #         subgroups = SubGroup.objects.filter(group_id=data)
    #     except SubGroup.DoesNotExist:
    #         subgroups = None
    #     serializer = SubGroupSerializer(subgroups, many=True)
    #     return Response(serializer.data)

    # def post(self, request, format='json'):
    #     data = request.data
    #     print(data)
    #     serializer = TeamSerializer(data=data)
    #     if serializer.is_valid():
    #         team = serializer.save()

    #         if team:
    #             json = serializer.data
    #             return Response(json, status=status.HTTP_201_CREATED)
    #         else:
    #             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #     else:
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RatingCriterias(APIView):
    ### permission classuud daraa n ustgah ###
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request, format='json'):
        group_id = request.query_params['group_id']
        try:
            group = Group.objects.get(id = group_id)
            g_ser = GroupSerializer(group)
            teacher_id = g_ser.data['teacher_id']
            rc = RatingCriteria.objects.filter(teacher_id = teacher_id, is_default = True)
        except RatingCriteria.DoesNotExist:
            rc = None
        serializer = RatingCriteriaSerializer(rc, many=True)
        return Response(serializer.data)


class GroupRatings(APIView):
    ### permission classuud daraa n ustgah ###
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request, format='json'):
        subgroup_id = request.query_params['subgroup_id']
        group_id = request.query_params['group_id']
        team_list = []

        team_member = TeamMember.objects.filter(
            group_student_id__group_id=group_id, subgroup_id=subgroup_id).values()
        for i in team_member:
            rating = Ratings.objects.filter(
                team_member_id=i['id']).values('rating_value')
            rating_list = [d['rating_value'] for d in rating]
            if rating_list:
                avg_value = sum(rating_list) / len(rating_list)
                avg_decimal = float("{:.2f}".format(avg_value))
                i['avg_value'] = avg_decimal
            else:
                i['avg_value'] = 0
            group_students = GroupStudents.objects.filter(
                id=i['group_student_id_id']).values()
            student_id = group_students[0]['student_id_id']
            student_info = Users.objects.filter(id=student_id).values()
            i['first_name'] = student_info[0]['first_name']
            i['email'] = student_info[0]['email']
            print(student_info)
        return Response(team_member)
class RatingsAll(APIView):
    ### permission classuud daraa n ustgah ###
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()  
    def get(self, request):
        student_id = request.query_params['student_id']
        group_students = GroupStudents.objects.filter(student_id = student_id)
        gs_serializer = GroupStudentSerializer(group_students, many = True)

        group_id_list = [i['group_id'] for i  in gs_serializer.data] 
        group_student_id_list = [i['id'] for i  in gs_serializer.data] 

        subgroup = SubGroup.objects.filter(group_id__in = group_id_list)
        sg_ser = SubGroupSerializer(subgroup, many = True)

        team_member = TeamMember.objects.filter(group_student_id__in = group_student_id_list)
        tm_ser = TeamMemberSerializer(team_member, many = True)
        tm_id_list = [i['id'] for i  in tm_ser.data] 
        
        rating = Ratings.objects.filter(team_member_id__in = tm_id_list).values_list('rating_value')
        rating_test = Ratings.objects.filter(team_member_id__in = tm_id_list)
        r_ser = RatingSerializer(rating_test, many = True)
        # define a fuction for key
        def key_func(k):
            return k['rc_name']
        
        # sort INFO data by 'company' key.
        INFO = sorted(r_ser.data, key=key_func)
        criteria_list = []
        for key, value in groupby(INFO, key_func):
            rating_list = [i['rating_value'] for i in value]
            if len(rating_list)!=0:
                avg = sum(rating_list) / len(rating_list)
            else:
                avg = 'Үнэлгээгүй байна'
            criteria_list.append({'rating_name':key,'rating_value':avg})
        rating_list = [item for t in rating for item in t]
        
        if len(rating_list)!=0:
            avg = sum(rating_list) / len(rating_list)
        else:
            avg = 'Үнэлгээгүй байна'
        return Response({'main_avg':avg, 'criteria_avg':criteria_list})




class LessonRatings(APIView):
    ### permission classuud daraa n ustgah ###
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()  

    def get(self, request, format='json'):
        student_id = request.query_params['student_id']
        group_students = GroupStudents.objects.filter(student_id = student_id)
        gs_serializer = GroupStudentSerializer(group_students, many = True)

        group_id_list = [i['group_id'] for i  in gs_serializer.data] 
        group_student_id_list = [i['id'] for i  in gs_serializer.data] 
        group_info = []
        ### tuhain oyutnii unelgeeg group tus bureer avah
        for i in group_id_list:
            subgroups = SubGroup.objects.filter(group_id = i)
            sg_serializer = SubGroupSerializer(subgroups, many=True)

            group_students = GroupStudents.objects.get(group_id = i, student_id = student_id)
            g_serializer = GroupStudentSerializer(group_students)
            group_student_id = g_serializer.data['id']
            all_rating_list = []
            ###CRITERIAGAAR AVAH HESEG
            team_member = TeamMember.objects.filter(group_student_id = group_student_id)
            tm_ser = TeamMemberSerializer(team_member, many = True)
            tm_id_list = [i['id'] for i  in tm_ser.data] 
            
            rating_test = Ratings.objects.filter(team_member_id__in = tm_id_list)
            r_ser = RatingSerializer(rating_test, many = True)

            ### COMMENT AVAH HESEG
            comment_id_list = [i['comment_id'] for i  in r_ser.data] 
            res = []
            [res.append(x) for x in comment_id_list if x not in res]
            comments = Comments.objects.filter(id__in = res)
            c_ser = CommentSerializer(comments, many = True)
            good_comm = [i['good_comm'] for i in c_ser.data]
            bad_comm = [i['bad_comm'] for i in c_ser.data]

            # define a fuction for key
            def key_func(k):
                return k['rc_name']
            
            # sort INFO data by 'company' key.
            INFO = sorted(r_ser.data, key=key_func)
            criteria_list = []
            for key, value in groupby(INFO, key_func):
                rating_list = [i['rating_value'] for i in value]
                if len(rating_list)!=0:
                    avg = sum(rating_list) / len(rating_list)
                else:
                    avg = 'Үнэлгээгүй байна'
                criteria_list.append({'rating_name':key,'rating_value':avg})
            for j in sg_serializer.data:
                teams = TeamMember.objects.filter(subgroup_id = j['id'], group_student_id = group_student_id)
                t_serializer = TeamMemberSerializer(teams, many=True)
                for z in t_serializer.data:
                    rating = Ratings.objects.filter(team_member_id = z['id']).values_list('rating_value')
                    rating_list = [item for t in rating for item in t]
                    all_rating_list.extend(rating_list)
            

            if len(all_rating_list)==0:
                avg = 'Үнэлгээгүй байна'
            else:
                avg = sum(all_rating_list) / len(all_rating_list)
            group = Group.objects.get(id = i)
            g_serializer = GroupSerializer(group)
            g_data = g_serializer.data
            group_info.append({'lesson_name':g_data['lesson_name'], 'group_id':g_data['id'], 'rating_value':avg, 'criteria_rating':criteria_list, 'good_comm':good_comm, 'bad_comm':bad_comm})
        return Response(group_info)
        

class Rated(APIView):
    ### permission classuud daraa n ustgah ###
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()  

    def post(self, request, format='json'):
        team_member_id = request.data['team_member_id']
        user_id = request.data['user_id']
        try:
            my_rated_mates = Ratings.objects.filter(team_member_id__in = team_member_id, rated_by_id=user_id)
        except Ratings.DoesNotExist:
            my_rated_mates = None
        serializer = RatingSerializer(my_rated_mates, many= True)
        rated_member_list=[]
        for i in serializer.data:
            if i['team_member_id'] not in rated_member_list:
                rated_member_list.append(i['team_member_id'])
        return Response({'rated_member_list':rated_member_list})




class Rating(APIView):
    ### permission classuud daraa n ustgah ###
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data['post_list']
        good_comm = request.data['good_comm']
        bad_comm = request.data['bad_comm']
        user_id = request.data['user_id']

        comment = Comments.objects.create(
            bad_comm=bad_comm, good_comm=good_comm)
        for i in data:
            i['comment_id'] = comment.id
            i['rated_by_id'] = user_id
            serializer = RatingSerializer(data=i)
            if serializer.is_valid():
                rating = serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({'status': 'success'})


class RC(APIView):
    ### permission classuud daraa n ustgah ###
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def get(self, request):
        teacher_id = request.query_params['teacher_id']
        try:
            rc = RatingCriteria.objects.filter(teacher_id=teacher_id)
        except RatingCriteria.DoesNotExist:
            rc = None
        
        rc_ser = RatingCriteriaSerializer(rc, many = True)
        return Response(rc_ser.data)
    def post(self, request):
        serializer = RatingCriteriaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
            return Response({'status':'success'})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request):
        serializer = RatingCriteriaSerializer(data=request.data)
        id = request.data['id']
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            data = serializer.data
            new_rc = RatingCriteria.objects.filter(id = id).update(**data)
            return Response({'status':'success'})
        
            
