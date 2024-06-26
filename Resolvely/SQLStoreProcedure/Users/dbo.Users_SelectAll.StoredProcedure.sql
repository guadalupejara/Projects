USE [Resolvely]
GO
/****** Object:  StoredProcedure [dbo].[Users_SelectAll]    Script Date: 1/8/2024 5:14:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Luca Chitayat
-- Create date: 11/26/2023
-- Description:	SelectAll paginated for dbo.Users
-- Code Reviewer:

-- MODIFIED BY: Pollyanna Easterbrook
-- MODIFIED DATE: 1/3/24
-- Code Reviewer: Kristine Viray
-- Note: Removed Pagination and changed selected table data
-- =============================================



CREATE Proc [dbo].[Users_SelectAll]
	

as

/*TestCode

Exec dbo.Users_SelectAll	

*/


BEGIN



SELECT u.[Id]
		,[FirstName]
		,[LastName]
		,[Mi]
		,[AvatarUrl]
		,[Email]
		,[IsConfirmed]
		,[StatusId]
		,st.Name as Status
		,[DateCreated]
		,[DateModified]
		,r.Id as RoleId
		,r.Name as Role
  FROM [dbo].[Users] as u 
  inner join dbo.StatusTypes as st
  on u.StatusId = st.Id
  inner join dbo.Roles as r
  on u.RoleId = r.Id
  

  ORDER BY u.Id

  END

GO
