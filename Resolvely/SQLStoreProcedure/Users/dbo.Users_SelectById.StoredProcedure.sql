USE [Resolvely]
GO
/****** Object:  StoredProcedure [dbo].[Users_SelectById]    Script Date: 11/22/2023 6:07:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Luca Chitayat
-- Create date: 11/22/2023
-- Description:	SelectById for dbo.Users - uses GetCurrentUser to retrieve Id. "Role" uses roleId for lookup. 
-- Code Reviewer: Jordin Camp

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================



CREATE Proc [dbo].[Users_SelectById]
	@Id int

as

/*TestCode

Declare
@Id int = 7

Exec dbo.Users_SelectById	
@Id

Declare
@PageIndex int = 0
,@PageSize int = 3

EXEC dbo.Users_SelectAll
@PageIndex,@PageSize

*/


BEGIN



SELECT Users.[Id]
      ,[FirstName]
      ,[LastName]
	  ,[Mi]
	  ,[AvatarUrl]
	  ,[Email]
		,"Role" = (SELECT [Name]
				FROM dbo.Roles as r inner join dbo.Users as u
				ON r.Id = u.RoleId
				WHERE u.Id = @Id)

  FROM [dbo].[Users] 
		WHERE Users.Id = @Id
 

  END

GO
